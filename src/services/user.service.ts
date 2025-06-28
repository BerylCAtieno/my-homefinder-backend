import { PrismaClient} from "../generated/prisma";
import HTTPException from "../exceptions/http.exception";
import {StatusCodes} from "http-status-codes";
import {isEmpty} from "../utils/isEmpty.util";
import {UpdateProfileInterface} from "../interfaces/profile.interface";
import {MulterFile} from "../interfaces/multerFile.interface";

export class UserService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
    }

    public updateUserProfile = async (userId: string, data: UpdateProfileInterface) => {
        if (isEmpty(data)) {
            throw new HTTPException(StatusCodes.BAD_REQUEST, "Empty User Profile Data");
        }
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            include: {
                role: true,
                tenantProfile: true,
                landlordProfile: true,
            }
        })
        if (!user) {
            throw new HTTPException(StatusCodes.NOT_FOUND, "User not found");
        }

        // update Tenant Profile user.role.name === "TENANT"
        if (user.role.name === "TENANT") {
            const updatedProfile = await this.prisma.tenantProfile.update({
                where: {userId: user.id},
                data: {
                    ...data
                }
            })
            return {message: "Tenant profile updated successfully", data: updatedProfile};
        }

        // update Landlord Profile user.role.name === "LANDLORD"
        if (user.role.name === "LANDLORD") {
            const updatedProfile = await this.prisma.landLordProfile.update({
                where: {userId: user.id},
                data: {
                    ...data
                }
            })
            return {message: "Landlord profile updated successfully", data: updatedProfile};
        }
    }

    public uploadProfilePic = async (userId: string, file: MulterFile) => {
        if (!file) {
            throw new HTTPException(StatusCodes.BAD_REQUEST, "File is missing");
        }
        const user = await this.prisma.user.findUnique({
            where: {id: userId},
        });
        if (!user) throw new HTTPException(StatusCodes.NOT_FOUND, "User not Found")
        const role = await this.prisma.role.findUnique({
            where: {id: user.roleId}
        })
        if (!role) throw new HTTPException(StatusCodes.NOT_FOUND, "User Role does not exist")
        // Correctly update profile image for tenant or landlord
        if (role.name === "TENANT") {
            await this.prisma.tenantProfile.update({
                where: { userId: user.id },
                data: { profileImage: file.path }
            });
        } else if (role.name === "LANDLORD") {
            await this.prisma.landLordProfile.update({
                where: { userId: user.id },
                data: { profileImage: file.path }
            });
        }
        return { success: true, message: "User Profile image saved successfully" };
    }

    // Get a user by ID
    public getUserById = async (userId: string) => {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { role: true, tenantProfile: true, landlordProfile: true }
            });
            if (!user) throw new HTTPException(StatusCodes.NOT_FOUND, "User not found");
            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
            }
            throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, "Unknown error");
        }
    }

    // Get all users
    public getAllUsers = async () => {
        try {
            return await this.prisma.user.findMany({
                include: { role: true, tenantProfile: true, landlordProfile: true }
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
            }
            throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, "Unknown error");
        }
    }

    // Update a user by ID
    public updateUser = async (userId: string, updateData: any) => {
        if (isEmpty(updateData)) {
            throw new HTTPException(StatusCodes.BAD_REQUEST, "Update data is empty");
        }
        try {
            const user = await this.prisma.user.update({
                where: { id: userId },
                data: updateData
            });
            return { message: "User updated successfully", data: user };
        } catch (error) {
            if (error instanceof Error) {
                throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
            }
            throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, "Unknown error");
        }
    }

    // Delete a user by ID
    public deleteUser = async (userId: string) => {
        try {
            await this.prisma.user.delete({
                where: { id: userId }
            });
            return { message: "User deleted successfully" };
        } catch (error) {
            if (error instanceof Error) {
                throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
            }
            throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, "Unknown error");
        }
    }
}