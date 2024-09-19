import cors from "cors";
import express from "express";
// import { router } from "./routes/route.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const app = express();
const port = process.env.PORT || 8088;
const connectingString = process.env.CONNECT_STRING;

let corsOptions = {
  origin: [process.env.FRONT_ACCESS_URL],
};

app.use(cors(corsOptions));
app.use(express.json());

//connect DB
mongoose
  .connect(connectingString)
  .then(() => {})
  .catch((err) => {
    throw err;
  });

app.get("/", (req, res) => {
  res.send("Hello, Employee Management System API!");
});

// mongoose
//   .connect(process.env.CONNECT_STRING)
//   .then(() => {
//     app.listen(serverPort, () => {
//       console.log(`Server Running on http://localhost:${serverPort}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//     // console.error("Connection error", err);
//     // process.exit();
//   });

// app.use("/", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
