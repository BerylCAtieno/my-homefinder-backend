import { Request,Response } from "express"
import userProfilesCreation from "../services/userProfileCreation.service"
import updateProfile from "../services/updateProfile.service"
import getProfileInstance from "../services/getProfile.service"
import { RequestWithUser } from "../interfaces/auth.interface"
import { prisma } from "../prisma/prisma"


const profileCreation = new userProfilesCreation
class usercontroller{
    
    public createProfile  = async (req:RequestWithUser,res:Response) => {
       try {
         const userRoleId = req.user.roleId
         const userRoleResponse = await prisma.role.findFirst({
            where:{id:userRoleId}
         })
        const userRole = userRoleResponse?.name
        const image = req.file?.path
        const body = req.body
        console.log(userRole)
        if(!image){throw new Error("user image is required")}
        if(userRole == 'tenant'){
        const createProfile = await profileCreation.createProfileTenant(image,body)
        res.status(200).json({
            success:true,
            message:"tenant profile creation was succesfully",
            data:createProfile
        })
    }

    if(userRole == 'landlord'){
        // landlord logic from service
        const createProfile = await profileCreation.createProfileLandlord(image,body)
        res.status(200).json({
            success:true,
            message:"landlord profile creation was successfully",
            data:createProfile
        })
    }

       } catch (error) {
        if(error instanceof Error){
            res.status(404).json({
                success:false,
                message:"an error occured",
                data:error.message
            })
        }
       }

    }

    public updateProfile = async (req:RequestWithUser,res:Response) => {
        const body = req.body
        const image = req.file?.path
        const userID = req.user.id
        
        const userRoleId = req.user.roleId
         const userRoleResponse = await prisma.role.findFirst({
            where:{id:userRoleId}
         })
        const userRole = userRoleResponse?.name

        if(userRole == "tenant"){
            try {
                const updateTenantProfile = await updateProfile.updateTenantProfile(image,body,userID)
                console.log(updateTenantProfile)
                res.status(200).json({
                    success:true,
                    message:"user profile updated successfully",
                    data:updateTenantProfile
                })
            } catch (error) {
                if(error){
                console.log(error)
                    res.status(404).json({
                        succes:false,
                        message:"an error occured, couldn't update tenant profile",
                        data:error
                    })
                }
            }
        }


        if(userRole == "landlord"){
            try {
                const updateLandlordProfile = await updateProfile.updateLandordProfile(image,body,userID)
                res.status(200).json({
                    success:true,
                    message:"user profile updated successfully",
                    data:updateLandlordProfile
                })
            } catch (error) {
                if(error){
                    console.log(error)
                    res.status(404).json({
                        succes:false,
                        message:"an error occured, couldn't update landlord profile",
                        data:error
                    })
                }
            }
        }
    }

    public getProfile = async (req:RequestWithUser,res:Response) => {
        const userId = req.params.userId
        const userRoleId = req.user.roleId
         const userRoleResponse = await prisma.role.findFirst({
            where:{id:userRoleId}
         })
        const userRole = userRoleResponse?.name
        if(userRole == 'Tenant'){
            try {
                const tenantProfile = await getProfileInstance.getTenantProfile(userId)
                res.status(200).json({
                    success:true,
                    message:"tenant profile gotten successfully",
                    data:tenantProfile
                })
            } catch (error) {
                if(error as Error){
                    res.status(404).json({
                    success:false,
                    message:"an error occured",
                    data:error
                    })
                }
                
            }
        }

        if(userRole == 'Landlord'){
            try {
                const landlordProfile = await getProfileInstance.getLandlordProfile(userId)
                res.status(200).json({
                    success:true,
                    message:"landlord profile gotten successfully",
                    data:landlordProfile
                })
            } catch (error) {
                if(error as Error){
                    res.status(404).json({
                    success:false,
                    message:"an error occured",
                    data:error
                })
                }
                
            }
        }

    }

    
}

const userProfileController = new usercontroller()

export default userProfileController