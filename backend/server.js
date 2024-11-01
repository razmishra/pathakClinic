import express from "express";
import patientRouter from "./routes/patientRoutes.js";

const router = express.Router();

router.get("/test", (req, res) => {
  try {
    return res.json({ message: "Server is running fine" });
  } catch (error) {
    return res.json(error);
  }
});

router.use("/patients", patientRouter);
export default router;
