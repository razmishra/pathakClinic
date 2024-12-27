import patientsModel from "../models/patientModel.js";

const addPatient = async (req, res) => {
  try {
    const { caseId, name, age, gender, contact, address, dateOfBirth } =
      req.body;

    const patient = new patientsModel({
      name,
      age,
      gender,
      contact,
      address,
      dateOfBirth,
    });
    patient.save();
    return patient;
  } catch (error) {
    console.log(error, " error in addPatient controller");
    return { success: false, errorMessage: error };
  }
};

const updatePatient = async (req, res) => {
  try {
    const { caseId } = req.params;
    const updateData = req.body;

    const patient = await patientsModel.findOneAndUpdate(
      { caseId: caseId, isDeleted: false },
      { $set: updateData },
      { new: true } // return the updated document
    );

    return patient;
  } catch (error) {
    console.log(error, " error in updatePatient controller");
    return { success: false, errorMessage: error };
  }
};

const getAllPatients = async (req, res) => {
  try {
    const {
      search,
      pageNo = 1,
      itemsPerPage = 10,
      sortKey,
      sortOrder,
    } = req.body;
    const skip = (pageNo - 1) * itemsPerPage;
    const query = { isDeleted: false };

    // Add search criteria if provided
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }];

      // Check if search can be converted to a number for caseId
      const caseIdSearch = Number(search);
      if (!isNaN(caseIdSearch)) {
        query.$or.push({ caseId: caseIdSearch });
      }
    }
    
    const sort = {};
    if (sortKey && sortOrder) {
      sort[sortKey] = sortOrder === "desc" ? -1 : 1;
    }

    const patients = await patientsModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(itemsPerPage);
    return patients;
  } catch (error) {
    console.log(error, " error in getAllPatients controller");
    return { success: false, errorMessage: error };
  }
};

const deletePatient = async (req, res) => {
  try {
    const { caseId } = req.params;
    const updateData = { isDeleted: true };

    const patient = await patientsModel.findOneAndUpdate(
      { caseId: caseId, isDeleted: false },
      { $set: updateData },
      { new: true } // return the updated document
    );

    return patient;
  } catch (error) {
    console.log(error, " error in deletePatient controller");
    return { success: false, errorMessage: error };
  }
};

export default {
  addPatient,
  updatePatient,
  getAllPatients,
  deletePatient,
};
