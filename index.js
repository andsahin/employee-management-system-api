import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { employeeRouter } from "./routes/employeeRoute.js";
import { router } from "./routes/route.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
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

app.use("/v0/", router);
app.use("/v0/", employeeRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
