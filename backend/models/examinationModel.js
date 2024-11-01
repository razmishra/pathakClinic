import mongoose from "mongoose";

const patientExaminationSchema = mongoose.Schema({
  CaseId: {
    type: Number,
    required: true,
  },
  dateOfExamination: {
    type: Date,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  treatmentPlan: {
    type: String,
    required: true,
  },
  prescribedMedications: {
    type: String,
    required: true,
  },
  prescribedTests: {
    type: String,
    required: true,
  },
  prescribedProcedures: {
    type: String,
    required: true,
  },
  prescribedSurgeries: {
    type: String,
    required: true,
  },
  prescribedLabTests: {
    type: String,
    required: true,
  },
});
