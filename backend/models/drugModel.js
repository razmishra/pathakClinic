import mongoose from "mongoose";

const drugListSchema = mongoose.Schema({
  drugName: {
    type: String,
    required: true,
  },
  potency: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  ml: {
    type: Number,
    required: true,
  },
  drawerNumber: {
    type: String,
  },
  description: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const drugListModel = mongoose.model("drugListModel", drugListSchema);
export default drugListModel;
