import patientsModel from "../models/patientModel.js";

const toggleAppointment = async (req, res) => {
  const { id } = req.params;
  const { inQueue } = req.body;
  try {
    const appointment = await patientsModel.findOneAndUpdate(
      { caseId: id },
      { $set: { showOnDashboard: inQueue } },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return appointment;
  } catch (error) {
    console.log("Error updating appointment list: ", error);
    throw error;
  }
};

export default {
  toggleAppointment,
};
