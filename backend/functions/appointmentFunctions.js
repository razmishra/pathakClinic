import appointmentController from "../controller/appointmentController.js";

const toggleAppointment = async (req, res) => {
  try {
    return appointmentController
      .toggleAppointment(req, res)
      .then((data) => {
        return {
          success: true,
          message: "Appointment list updaed successfully",
          data,
        };
      })
      .catch((error) => {
        throw { errorMessage: error };
      });
  } catch (error) {
    console.error("Error updating appointment list in function:", error);
    throw { errorMessage: error };
  }
};

export default {
  toggleAppointment,
};
