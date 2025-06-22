import { Preference} from '../generated/prisma'

export interface UpdateProfileInterface{
    firstName?: string
    otherName?: string
    lastName?: string
    phoneNumber?: string
    street?: string
    city?:string
    state?:string
    NIN?:string
    BVN?:string
    OtherInfo?:string
    address?:string
    preferences?: Preference
}