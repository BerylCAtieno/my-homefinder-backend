import { Router } from "express";
import { Routes } from "../interfaces/route.interface";
import { AuthController } from "../controllers/auth.controller";
import {
  validateForgotPassword,
  validateResetPassword,
} from "../middlewares/validation.middleware";
import {
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middlewares/rate-limiter.middleware";

export class AuthRoute implements Routes {
  public path = "/auth";
  public router: Router = Router();
  private authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/forgot-password",
      forgotPasswordLimiter,
      validateForgotPassword,
      this.authController.forgotPassword
    );

    this.router.post(
      "/reset-password",
      resetPasswordLimiter,
      validateResetPassword,
      this.authController.resetPassword
    );

    this.router.post("/signup", this.authController.signup);
    this.router.post("/login", this.authController.login);
  }
}