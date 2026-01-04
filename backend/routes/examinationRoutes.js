import express from "express";
import ExaminationFunctions from "../functions/examinationFunction.js";
import responseHandler from "../utils/responseHandler.js";
const examinationRouter = express.Router();

examinationRouter.get("/get-one/:caseId", async (req, res) => {
  return ExaminationFunctions.getExaminationByCaseId(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

examinationRouter.get("/get-all", async (req, res) => {
  return ExaminationFunctions.getAllExaminations(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

examinationRouter.post("/", async (req, res) => {
  return ExaminationFunctions.createOrUpdateExamination(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

export default examinationRouter;
