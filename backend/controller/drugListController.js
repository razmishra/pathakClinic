import drugListModel from "../models/drugModel.js";

const getAllDrugs = async (req, res) => {
  try {
    const drugs = await drugListModel.find({isDeleted: false});

    return drugs;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    throw error;
  }
};

const addNewDrug = async (req, res) => {
  try {
    const newDrug = new drugListModel(req.body);
    await newDrug.save();
    return newDrug;
  } catch (error) {
    console.log("Error adding new drug: ", error);
    throw error;
  }
};

const deleteDrug = async (req, res) => {
  try {
    const { id } = req?.params;
    // what will be unique in every drug list
    const drug = await drugListModel.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      {
        new: true,
      }
    );
    // what will be unique in every drug list
    return drug;
  } catch (error) {
    console.log("Error deleting drug: ", error);
    throw error;
  }
};

const updateDrug = async (req, res) => {
  try {
    const { id } = req.params;
    const drug = await drugListModel.findByIdAndUpdate({ _id: id }, req?.body, {
      new: true,
    });
    // what will be unique in every drug list
    return drug;
  } catch (error) {
    console.log("Error updating drug: ", error);
    throw error;
  }
};

export default {
  getAllDrugs,
  addNewDrug,
  deleteDrug,
  updateDrug,
};
