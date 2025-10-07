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
}

