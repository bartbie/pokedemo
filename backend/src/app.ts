import express from "express";
import { ENV } from "./env";

const APP = express();
const PORT = ENV.PORT;

APP.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

APP.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});