import PatientExamination from "../models/examinationModel.js";
import patientsModel from "../models/patientModel.js";
import moment from "moment"
const addPatient = async (req, res) => {
  try {
    const { caseId, name, age, gender, contact, address, occupation } =
      req.body;

    const patient = new patientsModel({
      caseId,
      name,
      age,
      gender,
      contact,
      address,
      occupation,
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
      date,
      includeExaminations = false,
      showOnDashboard = false,
    } = req.query;

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

    if (showOnDashboard) {
      query.showOnDashboard = true;
    }

    // Add date filter if provided
    if (date) {
      const startOfDay = moment(date).startOf("day").utc().toDate();
      const endOfDay = moment(date).endOf("day").utc().toDate();

      query.createdAt = {
        $gte: startOfDay,
        $lt: endOfDay,
      };
    }
    const sort = {};
    if (sortKey && sortOrder) {
      sort[sortKey] = sortOrder === "desc" ? -1 : 1;
    }

    // Get patients data
    const patients = await patientsModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(itemsPerPage);

    // Get total count of records matching the query
    const totalRecords = await patientsModel.countDocuments(query);

    // If examinations are requested, fetch and join them
    let patientsWithExaminations = patients;

    if (includeExaminations === "true" || includeExaminations === true) {
      // Get the case IDs from patients
      const caseIds = patients.map((patient) => patient.caseId);

      // Fetch examinations for these case IDs
      const examinations = await PatientExamination.find({
        caseId: { $in: caseIds },
      });

      // Create a map for quicker lookup
      const examinationMap = examinations.reduce((map, exam) => {
        map[exam.caseId] = exam;
        return map;
      }, {});

      // Combine patient data with examination data
      patientsWithExaminations = patients.map((patient) => {
        const patientObj = patient.toObject();
        patientObj.examination = examinationMap[patient.caseId] || null;
        return patientObj;
      });
    }

    return {
      patients: patientsWithExaminations,
      totalRecords,
    };
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

const dashboardRecord = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Total patients till now
    const totalPatients = await patientsModel.countDocuments({
      isDeleted: false,
    });

    // Today's new patients
    const todaysNewPatients = await patientsModel.countDocuments({
      isDeleted: false,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    // Total examinations till now
    const totalExaminations = await PatientExamination.countDocuments({});

    // Today's examinations
    const todaysExaminations = await PatientExamination.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    return {
      totalPatients,
      todaysNewPatients,
      totalExaminations,
      todaysExaminations,
    };
  } catch (error) {
    console.log(error, " error in dashboardRecord controller");
    return { success: false, errorMessage: error };
  }
};

export default {
  addPatient,
  updatePatient,
  getAllPatients,
  deletePatient,
  dashboardRecord,
};
