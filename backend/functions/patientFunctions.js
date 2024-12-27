import patientController from "../controller/patientController.js";
import patientsModel from "../models/patientModel.js";
import {
  validateContact,
  validateDateOfBirth,
  validateField,
} from "../utils/randomFunctions.js";

const addPatient = async (req, res) => {
  try {
    const { caseId, name, age, gender, contact, address, dateOfBirth } =
      req.body;
    // Validation rules
    const validations = [
      // { field: caseId, name: "Case ID" },
      { field: name, name: "Name" },
      { field: age, name: "Age" },
      { field: gender, name: "Gender" },
      { field: contact, name: "Contact", custom: validateContact(contact) },
      { field: address, name: "Address" },
      {
        field: dateOfBirth,
        name: "Date of birth",
        custom: validateDateOfBirth(dateOfBirth),
      },
    ];

    // Perform validations
    for (const { field, name, custom } of validations) {
      const errorMessage = custom || validateField(field, name);
      if (errorMessage) {
        return { success: false, message: errorMessage };
      }
    }

    // check if someone with the same caseId exists
    const existingPatient = await patientsModel.findOne({
      caseId: caseId,
      isDeleted: false,
    });
    if (existingPatient) {
      return {
        success: false,
        message: "Patient with this case ID already exists",
      };
    }

    // TO DO: implement patient addition logic

    return patientController
      .addPatient(req, res)
      .then((data) => {
        return { success: true, message: "Patient added successfully", data };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error(error, "error in addPatient");
    throw error;
  }
};

const getPatient = async (req, res) => {
  try {
    const { caseId } = req.params;
    if (!caseId) {
      return { success: false, message: "Case ID is required" };
    }

    const patient = await patientsModel.findOne({
      caseId: caseId,
      isDeleted: false,
    });

    if (!patient) {
      return { success: false, message: "Patient not found" };
    }
    return { success: true, patient };
  } catch (error) {
    console.error(error, "error in getPatient");
    throw error;
  }
};

const getAllPatient = async (req, res) => {
  try {
    return patientController
      .getAllPatients(req, res)
      .then((data) => {
        return { message: "Patients fetched succefully", data };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error(error, "error in getAllPatient");
    throw error;
  }
};

const updatePatient = async (req, res) => {
  try {
    const { caseId } = req.params;
    if (!caseId) {
      return { success: false, message: "caseId is missing" };
    }
    const patient = await patientsModel.findOne({
      caseId: caseId,
      isDeleted: false,
    });
    if (!patient) {
      return { success: false, message: "Patient not found" };
    }
    return patientController
      .updatePatient(req, res)
      .then((data) => {
        return { success: true, message: "Patient updated successfully", data };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error(error, "error in updatePatient");
    throw error;
  }
};

const deletePatient = async (req, res) => {
  try {
    const { caseId } = req.params;
    if (!caseId) {
      return { success: false, message: "caseId is missing" };
    }
    const patient = await patientsModel.findOne({
      caseId: caseId,
      isDeleted: false,
    });
    if (!patient) {
      return { success: false, message: "Patient not found" };
    }
    return patientController
      .deletePatient(req, res)
      .then((data) => {
        return { success: true, message: "Patient deleted successfully", data };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error(error, "error in deletePatient");
    throw error;
  }
};

const uploadFiles = async (req, res) => {
  try {
    const patientId = req.body.patientId;
    const files = req.files.map((file) => file.filename);
    if (!files.length) {
      return { success: false, message: "No file choosen" };
    }

    const patient = await patientsModel.findById(patientId);

    if (!patient) {
      return { success: false, message: "Patient not found" };
    }

    patient.fileName = patient.fileName.concat(files);
    await patient.save();

    return responseHandler.sendSuccess(res, patient, req);
  } catch (error) {
    console.log(error);
    return responseHandler.sendError(res, error, req);
  }
};

export default {
  addPatient,
  getPatient,
  getAllPatient,
  updatePatient,
  deletePatient,
  uploadFiles,
};
