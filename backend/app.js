import "./config.js";
import express from "express";
import cors from "cors"
const app = express();
import router from "./server.js";
import connectDb from "./connection/dbConnection.js";
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json());
app.use(router);
connectDb();

app.listen(PORT, () => {
  console.log("server listening on port", PORT);
});
