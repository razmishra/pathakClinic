import PatientExamination from "../models/examinationModel.js";
import patientsModel from "../models/patientModel.js";

const getExaminationByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;

    const examinationDetails = await PatientExamination.findOne({ caseId });
    const patientDetails = await patientsModel.findOne({
      caseId,
    });
    if (!examinationDetails && !patientDetails) {
      return {
        success: false,
        message: "No examination found with this Case ID",
      };
    }

    return { patientDetails, examinationDetails };
  } catch (error) {
    console.error("Error fetching examination:", error);
    return {
      success: false,
      message: "Server error while fetching examination details",
      error: error.message,
    };
  }
};

// Create or update examination record
const createOrUpdateExamination = async (req, res) => {
  try {
    const {
      patientName,
      date,
      caseId,
      contact,
      occupation,
      chiefComplaints,
      kco,
      diagnosis,
      prescriptions,
    } = req.body;

    let examination;

    // Check if record already exists
    if (caseId) {
      examination = await PatientExamination.findOne({ caseId });
    }

    if (examination) {
      // Update existing record
      examination.patientName = patientName;
      examination.date = date;
      examination.contact = contact;
      examination.occupation = occupation;
      examination.chiefComplaints = chiefComplaints;
      examination.kco = kco;
      examination.diagnosis = diagnosis;
      examination.prescriptions = prescriptions;

      await examination.save();

      return examination;
    } else {
      // Create new record
      examination = new PatientExamination({
        patientName,
        date,
        caseId,
        contact,
        occupation,
        chiefComplaints,
        kco,
        diagnosis,
        prescriptions,
      });

      await examination.save();

      return examination;
    }
  } catch (error) {
    console.error("Error saving examination:", error);

    // Handle duplicate key error (e.g., duplicate caseId)
    if (error.code === 11000) {
      return {
        success: false,
        message: "A record with this Case ID already exists",
        error: error.message,
      };
    }

    return {
      success: false,
      message: "Server error while saving examination",
      error: error.message,
    };
  }
};

// Get all examinations (could add pagination)
const getAllExaminations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Sort by most recent first
    };

    const examinations = await PatientExamination.find({})
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort);

    const totalRecords = await PatientExamination.countDocuments({});

    return { examinations, totalRecords };
  } catch (error) {
    console.error("Error fetching examinations:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching examinations",
      error: error.message,
    });
  }
};

export default {
  getExaminationByCaseId,
  createOrUpdateExamination,
  getAllExaminations,
};
