import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      default: "",
    },
    prescription: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const patientExaminationSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    caseId: {
      type: String,
      required: [true, "Case ID is required"],
      unique: true,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    chiefComplaints: {
      type: String,
      default: "",
    },
    kco: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    prescriptions: {
      type: [prescriptionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const PatientExamination = mongoose.model(
  "PatientExamination",
  patientExaminationSchema
);

export default PatientExamination;
