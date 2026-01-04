import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    caseId: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      // required: true,
    },
    fileName: [
      {
        fileName: String, // Stored filename
        originalName: String, // Original file name
        path: String, // Path to access file
        mimeType: String, // File type
        size: Number, // File size in bytes
        uploadDate: Date, // Upload timestamp
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    showOnDashboard: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const patientsModel = mongoose.model("patientsModel", patientSchema);
export default patientsModel;
