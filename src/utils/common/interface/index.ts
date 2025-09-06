import { GENDER, SYS_ROLE, USER_AGENT } from "../enums";

export interface IUser {
    fristName: string;
    lastName: string;
    fullName?: string;
    email: string;
    phoneNumber?: string;
    password: string;
    cridentialsUpdatedAt?: Date;
    role: SYS_ROLE;
    gender: GENDER;
    userAgent: USER_AGENT;
    otp?: string;
    otpExpiry?: Date;
    isVerified?: boolean;
}