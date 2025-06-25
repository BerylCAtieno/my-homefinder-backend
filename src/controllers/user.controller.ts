import {UserService} from "../services/user.service";
import {RequestWithUser} from "../interfaces/auth.interface";
import {NextFunction, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {UpdateProfileInterface} from "../interfaces/profile.interface";

export class UserController {
    private userService;

    constructor() {
        this.userService = new UserService();
    }

    public updateUserProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const updateProfileData: UpdateProfileInterface = req.body;
            const userId = req.user.id;
            const updatedProfile = await this.userService.updateUserProfile(userId, updateProfileData);
            res.status(StatusCodes.OK).json({
                updatedProfile
            })
        } catch (error) {
            next(error)
        }
    }
    public uploadProfilePic = async(req: RequestWithUser, res: Response, next: NextFunction) => {
        try{
            if(!req.file) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "No file uploaded"
                });
            }
            const profilePic = req.file
            const userId = req.user.id
            const uploadMessage = await this.userService.uploadProfilePic(userId, profilePic)
            res.status(StatusCodes.CREATED).json({
                uploadMessage
            })

        } catch (error) {
            next(error);
        }
    }

    // Get a user by ID
    public getUserById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            res.status(StatusCodes.OK).json(user);
        } catch (error) {
            next(error);
        }
    }

    // Get all users
    public getAllUsers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(StatusCodes.OK).json({message: "Users Fetched", data: users});
        } catch (error) {
            next(error);
        }
    }

    // Update a user by ID
    public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            const result = await this.userService.updateUser(userId, updateData);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    // Delete a user by ID
    public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const result = await this.userService.deleteUser(userId);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}