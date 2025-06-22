import { Router } from "express";
import { Routes } from "../interfaces/route.interface";
import { UploadController } from "../controllers/upload.controller";
import {
  uploadMiddleware,
  uploadMultipleMiddleware,
} from "../middlewares/upload.middleware";
import { asyncHandler } from "../utils/asyncHandler.util";
import { authMiddleware } from "../middlewares/auth.middleware";

export class UploadRoute implements Routes {
  public path = "/upload";
  public router: Router = Router();
  private uploadController = new UploadController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/`,
      [authMiddleware, uploadMiddleware],
      asyncHandler(this.uploadController.uploadDoc),
    );

    this.router.post(
      `/many`,
      [authMiddleware, uploadMultipleMiddleware],
      asyncHandler(this.uploadController.uploadMultipleDocs),
    );
  }
}
