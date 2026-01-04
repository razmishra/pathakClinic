import express from "express";
import appointmentFunctions from "../functions/appointmentFunctions.js";
import responseHandler from "../utils/responseHandler.js";
const appointmentRouter = express.Router();


appointmentRouter.patch("/toggle/:id", async (req, res) => {
  return appointmentFunctions
    .toggleAppointment(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

export default appointmentRouter;
