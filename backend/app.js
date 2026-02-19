import "./config.js";
import express from "express";
import cors from "cors";
const app = express();
import router from "./server.js";
import os from "os";
import connectDb from "./connection/dbConnection.js";
const PORT = process.env.PORT;
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(router);
connectDb();
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
const networkInterfaces = os.networkInterfaces();
let localIP;
// Find your machine's local IP dynamically
Object.keys(networkInterfaces).forEach((interfaceName) => {
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    // Skip over non-IPv4 and internal (localhost) interfaces
    if (iface.family === "IPv4" && !iface.internal) {
      localIP = iface.address;
      break;
    }
  }
});

const wss = new WebSocketServer({ port: 8080, host: "0.0.0.0" });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ localIP }));
  console.log("client connected")
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Backend server running at http://${localIP || "localhost"}:${PORT}`
  );
});
