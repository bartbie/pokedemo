import express from "express";
import { env } from "./env";
import { ProtectedHandler, authMiddleware } from "./lib/auth";
import {App, TypedHandler} from "./app";

const app = App();
const PORT = env.PORT;

app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});