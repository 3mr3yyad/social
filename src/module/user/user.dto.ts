import { ObjectId } from "mongoose";
import { GENDER } from "../../utils";

export interface UpdateUserDTO {
    fullName?: string;
    phoneNumber?: string;
    gender?: GENDER;
}

export interface UpdateEmailDTO {
    email: string;
    otp: string;
    expiryTime: Date;
    isVerified?: boolean;
}

export interface UpdatePasswordDTO {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface userActionDTO {
    currentUserId: ObjectId;
    recieverUserId: ObjectId;
}



