import {Router} from "express";
import {Routes} from "../interfaces/route.interface";
import {authMiddleware} from "../middlewares/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler.util";
import {UserController} from "../controllers/user.controller";
import {uploadMiddleware} from "../middlewares/upload.middleware";

export class UserRoute implements Routes {
  public path ="/users"
  public router = Router();
  public userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.patch("/updateprofile", authMiddleware, asyncHandler(this.userController.updateUserProfile))
        this.router.post("/uploadprofilepic", authMiddleware, uploadMiddleware, asyncHandler(this.userController.uploadProfilePic))
        this.router.get("/:id", authMiddleware, asyncHandler(this.userController.getUserById));
        this.router.get("/", authMiddleware, asyncHandler(this.userController.getAllUsers));
        this.router.patch("/:id", authMiddleware, asyncHandler(this.userController.updateUser));
        this.router.delete("/:id", authMiddleware, asyncHandler(this.userController.deleteUser));
    }
}

    