import express from "express";
import PatientFunction from "../functions/patientFunctions.js";
import responseHandler from "../utils/responseHandler.js";
const patientRouter = express.Router();
import multer from "multer";
const upload = multer({ dest: "uploads/" });

patientRouter.post("/create-one", async (req, res) => {
  return PatientFunction.addPatient(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

patientRouter.get("/get-one/:caseId", async (req, res) => {
  return PatientFunction.getPatient(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

patientRouter.get("/get-all", async (req, res) => {
  return PatientFunction.getAllPatient(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

patientRouter.patch("/update-one/:caseId", async (req, res) => {
  return PatientFunction.updatePatient(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

patientRouter.patch("/delete-one/:caseId", async (req, res) => {
  return PatientFunction.deletePatient(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

patientRouter.post("/upload", upload.single("files"), async (req, res) => {
  try {
    return PatientFunction.uploadFiles(req, res)
      .then((result) => {
        return responseHandler.sendSuccess(res, result, req);
      })
      .catch((error) => {
        return responseHandler.sendError(res, error, req);
      });
  } catch (error) {
    console.log(error);
    return responseHandler.sendError(res, error, req);
  }
});

export default patientRouter;
