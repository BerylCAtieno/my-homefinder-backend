import upload from "../middlewares/upload"
import userProfileController from "../controllers/profileCreation.controller";
import {RequestHandler, Router} from "express";
import { Routes } from "../interfaces/route.interface";
import tenantAccess from "../middlewares/tenantAccess.middleware";
import landLordAccess from "../middlewares/landLordAccess.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler.util";

export class UserRoute implements Routes {
  public path ="/api/v1/users"
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }
  // create profile eendpoint will be lik'be /createProfile/userId?user=tenent, can also be ?user=landlord
  //same as that of update profile

  private initializeRoutes() {
    this.router.post("/createProfile", upload.single("image"),authMiddleware,  asyncHandler(userProfileController.createProfile));
    this.router.patch("/updateProfile", upload.single("image"),authMiddleware, asyncHandler(userProfileController.updateProfile))
    this.router.get("/getTenantProfile",authMiddleware,tenantAccess as RequestHandler ,asyncHandler(userProfileController.getProfile))
    this.router.get("/getLandlordProfile",authMiddleware,landLordAccess as RequestHandler,asyncHandler(userProfileController.getProfile))
  }
}