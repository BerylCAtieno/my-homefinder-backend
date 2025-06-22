import cloudinary from "../config/uploadProfileImageCloudinary"
import fs from 'fs'
import { prisma } from '../prisma/prisma';
import { tenantProfileInterface } from "../interfaces/profile.interface"
class userProfilesCreation{
    
    public async createProfileTenant(image:string,body:tenantProfileInterface){
        console.log(body)
        const {fullName,phoneNumber,street,city,state,NIN} = body
        if(!image){throw new Error("user profile is required")}


        const uploadedImg = await cloudinary.uploader.upload(image,{    
            folder:'uploads'
        })
    
        const imageUrl = uploadedImg.secure_url

        fs.unlinkSync(image)
        console.log(imageUrl)
        if(!fullName || fullName == ''){throw new Error('fullname is required')}
        if(!phoneNumber || phoneNumber == ''){throw new Error('fullname is required')}
        if(!street || street == ''){throw new Error('fullname is required')}
        if(!city || city == ''){throw new Error('fullname is required')}
        if(!state || state == ''){throw new Error('fullname is required')}
        if(!NIN || NIN == ''){throw new Error('fullname is required')}
        // fetch user data 
        // where userId = dskdjsdj
        const user = await prisma.user.findUnique({
            where:{id : "dskdjsdj"}
        })
        if(!user){
            throw new Error("user does not exist")
        }
        const checkProfile = await prisma.tenantProfile.findFirst({
            where:{userId : user.id}
        })
        if(checkProfile){
            throw new Error("profile already exists");
        }
        const tenantProfile = await prisma.tenantProfile.create({
            data: {
                profileImage: imageUrl,
        fullName: fullName,
        phoneNumber: phoneNumber,
        street: street,
        city: city,
        state: state,
        NIN: NIN,
        user: {
          connect: { id: user.id }
        }
            }
        })


        return {message:'succesfully created user profile',tenantProfile}
    }

    public async createProfileLandlord(image:string,body:any){
        console.log(body)
        const {typeOfHouse,numberOfRooms,otherInfo,street,preferences,NIN,driversLicense,BVN} = body
        
        if(!image){throw new Error("user profile is required")}
         if(!typeOfHouse || typeOfHouse == ''){throw new Error('Type Of House is required')}
        if(!numberOfRooms || numberOfRooms == ''){throw new Error('number of rooms is required')}
        if(!otherInfo || otherInfo == ''){throw new Error('other info is required')}
        if(!street || street == ''){throw new Error('street is required')}
        if(!preferences || preferences == ''){throw new Error('preferences is required')}
        if(!NIN || NIN == ''){throw new Error('NIN is required')}
        if(!driversLicense || driversLicense == ''){throw new Error('drivers license is required')}
        if(!BVN || BVN == ''){throw new Error('BVN is required')}

        const uploadedImg = await cloudinary.uploader.upload(image,{
            folder:'uploads'
        })
        // check if user exists
        const user = await prisma.user.findUnique({
            where:{id:"dskdjsdj"}
        })
        if(!user){
            throw new Error("user does not exist")
        }
    
        const imageUrl = uploadedImg.secure_url
        fs.unlinkSync(image)

       
        // upload to psql database
        const createLandlordProfile = await prisma.landLordProfile.create({
            data:{
                profileImage:imageUrl,
                typeOfHouse:typeOfHouse,
                numberOfRooms:numberOfRooms,
                otherInfo:otherInfo,
                street:street,
                preference:preferences,
                NIN:NIN,
                driversLicense:driversLicense,
                BVN:BVN,
                user:{
                    connect:{ id: user.id}
                }
            }
        })
        return {message:'succesfully created user profile',createLandlordProfile}
    }

    
}


export default userProfilesCreation