import { GENDER } from "../../utils";

export interface RegisterDto {
    fullName?: string;
    email: string;
    phoneNumber?: string;
    password: string;
    gender: GENDER;
}

export interface IUpdateUserDto extends Partial<RegisterDto>{
    
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface VerifyEmailDTO {
    email: string;
    otp: string;
}


