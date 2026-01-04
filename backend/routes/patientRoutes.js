import express from "express";
import PatientFunction from "../functions/patientFunctions.js";
import responseHandler from "../utils/responseHandler.js";
const patientRouter = express.Router();
import multer from "multer";
// const upload = multer({ dest: "uploads/" });
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create upload directory if it doesn't exist
const createUploadDir = () => {
  const uploadDir = path.join(__dirname, "../public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = createUploadDir();
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 35 * 1024 * 1024, // 35MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error(
        "Invalid file type. Only JPEG, PNG and GIF are allowed."
      );
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }
    cb(null, true);
  },
});

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

patientRouter.get("/generate-case-id", async (req, res) => {
  return PatientFunction.generateCaseId(req, res)
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

patientRouter.post("/upload", upload.array("files", 5), async (req, res) => {
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

patientRouter.get("/dashboard-record", async (req, res) => {
  return PatientFunction.dashboardRecord(req, res)
    .then((result) => {
      return responseHandler.sendSuccess(res, result, req);
    })
    .catch((error) => {
      return responseHandler.sendError(res, error, req);
    });
});

export default patientRouter;
