import { Router } from "express";
import { Routes } from "../interfaces/route.interface";
import { VerificationController } from "../controllers/verification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class VerificationRoute implements Routes {
  public path = "/verification";
  public router = Router();
  private verificationController = new VerificationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/id`,
      authMiddleware,
      this.verificationController.verify,
    );
  }
}
