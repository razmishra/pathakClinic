import ExaminationController from "../controller/examinationController.js";

const getExaminationByCaseId = async (req, res) => {
  try {
    console.log("getExaminationByCaseId")
    const { caseId } = req.params;
    if (!caseId) {
      return {
        success: false,
        message: "Case ID is required",
      };
    }

    return ExaminationController.getExaminationByCaseId(req, res)
      .then((data) => {
        return {
          success: true,
          message: "Examination list fetched successfully",
          data,
        };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error("Error fetching examination list in function", error);
    throw { errorMessage: error };
  }
};

const createOrUpdateExamination = async (req, res) => {
  try {
    const { patientName, date, caseId } = req.body;
    // Validate required fields
    if (!patientName) {
      return {
        success: false,
        message: "Patient name is required",
      };
    }

    if (!caseId) {
      return {
        success: false,
        message: "Case Id is required",
      };
    }

    if (!date) {
      return {
        success: false,
        message: "Date is required",
      };
    }

    return ExaminationController.createOrUpdateExamination(req, res)
      .then((data) => {
        return {
          success: true,
          message: "Examination list created/updated successfully",
          data,
        };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error(
      "Error creating/updating examination list in function",
      error
    );
    throw { errorMessage: error };
  }
};

const getAllExaminations = async (req, res) => {
  try {
    return ExaminationController.getAllExaminations(req, res)
      .then((data) => {
        return {
          success: true,
          message: "Examination list fetched successfully",
          data,
        };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error("Error fetching examination list in function", error);
    throw { errorMessage: error };
  }
};

export default {
  getExaminationByCaseId,
  createOrUpdateExamination,
  getAllExaminations,
};
