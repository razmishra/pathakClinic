import drugListController from "../controller/drugListController.js";
import drugListModel from "../models/drugModel.js";

const getAllDrugs = async (req, res) => {
  try {
    return drugListController
      .getAllDrugs(req, res)
      .then((data) => {
        return {
          success: true,
          message: "Drug list fetched successfully",
          data,
        };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error("Error fetching drugs in function:", error);
    throw { errorMessage: error };
  }
};

const addNewDrug = async (req, res) => {
  try {
    if (!req?.body) {
      return { success: false, errorMessage: "provide all fields" };
    }
    return drugListController
      .addNewDrug(req, res)
      .then((data) => {
        return { success: true, message: "Drug added successfully", data };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error("Error adding new drug: ", error);
    throw { errorMessage: error };
  }
};

const deleteDrug = async (req, res) => {
  try {
    const { id } = req?.params;
    if (!id) {
      return { success: false, errorMessage: "provide an id of drug" };
    }

    const isAlreadyDeleted = await drugListModel.findById({ _id: id });
    if (isAlreadyDeleted?.isDeleted) {
      return { success: false, errorMessage: "Drug is already deleted" };
    }

    return drugListController
      .deleteDrug(req, res)
      .then((data) => {
        return { success: true, message: "Drug deleted successfully", data };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error("Error adding new drug: ", error);
    throw { errorMessage: error };
  }
};

const updateDrug = async (req, res) => {
  try {
    const { id } = req?.params;
    if (!id) {
      return { success: false, errorMessage: "provide an id of drug" };
    }

    const checkIfExists = await drugListModel.findById({ _id: id });
    if (!checkIfExists) {
      return { success: false, errorMessage: "Drug not found" };
    }

    return drugListController
      .updateDrug(req, res)
      .then((data) => {
        return { success: true, message: "Drug deleted successfully", data };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error("Error adding new drug: ", error);
    throw { errorMessage: error };
  }
};

export default {
  getAllDrugs,
  addNewDrug,
  deleteDrug,
  updateDrug,
};
