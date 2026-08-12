import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import Config from "./config/config.js";

const corsOption = {
    origin: Config.frontend_url,
    credentials: true,
}

export const Middleware = (app) => {
    app.use(express.json({ limit: "16kb" }));
    app.use(express.urlencoded({ extended: true, limit: "16kb" }));
    app.use(express.static("public"));
    app.use(cookieParser());
    app.use(cors(corsOption));
    app.use(morgan("dev"));
}
