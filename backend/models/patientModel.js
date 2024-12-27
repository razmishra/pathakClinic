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
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    fileName: {
      type: Array,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.pre("validate", async function (next) {
  // Check if the document is new
  if (this.isNew) {
    // Find the last patient document sorted by caseId in descending order
    const lastPatient = await this.constructor.findOne().sort({ caseId: -1 });

    // If a last patient exists, set the new caseId to be one more than the last caseId
    // Otherwise, set the caseId to 1 (for the first patient)
    this.caseId = lastPatient ? lastPatient.caseId + 1 : 1;
  }
  // Proceed to the next middleware or save operation
  next();
});
const patientsModel = mongoose.model("patientsModel", patientSchema);
export default patientsModel;
