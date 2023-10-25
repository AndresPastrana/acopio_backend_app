import cors from "cors";
import morgan from "morgan";
import express, { Application } from "express";
import { Server } from "node:http";
import {
  AuthRouter,
  ProducerRouter,
  ProductiveBaseRouter,
  ProvinceRouter,
  ReportRouter,
  RouteRouter,
  StateRouter,
  TankRouter,
} from "../routes/index.routes.js";
import { Routes } from "../types.d.js";
export function gracefulShutdown(server: Server) {
  console.log("Received shutdown signal. Shutting down gracefully...");

  server.close(() => {
    console.log("Server has been gracefully shut down.");
    // Perform any additional cleanup or resource release here
    process.exit(0); // Exit the process
  });
}

export function defineMiddlewares(app: Application) {
  // Croos origin resurce sharing
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: "*",
      methods: ["POST", "GET", "DELETE", "PUT"],
    })
  );

  // Append the body to the request object
  app.use(express.json());

  // Routes
  app.use(Routes.auth, AuthRouter);
  app.use(Routes.producers, ProducerRouter);
  app.use(Routes.tanks, TankRouter);
  app.use(Routes.productiveBases, ProductiveBaseRouter);
  app.use(Routes.routes, RouteRouter);
  app.use(Routes.province, ProvinceRouter);
  app.use(Routes.state, StateRouter);
  app.use(Routes.report, ReportRouter);
}
