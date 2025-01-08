import express from "express";
import PatientFunction from "../functions/patientFunctions.js";
import responseHandler from "../utils/responseHandler.js";
const drugListRouter = express.Router();
import multer from "multer";
import drugListFunctions from "../functions/drugListFunctions.js";
const upload = multer({ dest: "uploads/" });

drugListRouter.get("/get-all", async (req, res) => {
  return drugListFunctions
    .getAllDrugs(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

drugListRouter.post("/add-one", async (req, res) => {
  return drugListFunctions
    .addNewDrug(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

drugListRouter.delete("/delete-one/:id", async (req, res) => {
  return drugListFunctions
    .deleteDrug(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

drugListRouter.patch("/update-one/:id", async (req, res) => {
  return drugListFunctions
    .updateDrug(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

export default drugListRouter;
