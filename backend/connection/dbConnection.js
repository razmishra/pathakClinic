import "../config.js"
import mongoose from "mongoose"

const connectionString = process.env.CONNECTION_STRING;
// console.log(connectionString,"--connection-string");

function connectDb() {
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}

export default connectDb;
