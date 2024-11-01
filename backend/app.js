import express from "express";
const app = express();
import router from "./server.js"
import connectDb from "./connection/dbConnection.js";

const PORT = process.env.PORT || 5000;

app.use(router);
app.use(express.json())
connectDb()

app.listen(PORT, () => {
  console.log("server listening on port", PORT);
});
