import { z } from "zod";
import { GENDER } from "../../utils";
import { UpdateEmailDTO, UpdatePasswordDTO, UpdateUserDTO as UpdateUserDTO } from "./user.dto";

export const updateUserSchema = z.object<UpdateUserDTO>({
    fullName: z.string().min(3).max(50).optional() as unknown as string,
    phoneNumber: z.string().regex(/^(\+20|0020|0)?1[0125][0-9]{8}$/).optional() as unknown as string,
    gender: z.enum(GENDER).optional() as unknown as GENDER,
});

export const updateEmailSchema = z.object<UpdateEmailDTO>({
    email: z.email() as unknown as string,
    otp: z.string().length(5) as unknown as string,
    expiryTime: z.date().optional() as unknown as Date,
});

export const updatePasswordSchema = z.object<UpdatePasswordDTO>({
    oldPassword: z.string().min(8).max(50) as unknown as string,
    newPassword: z.string().min(8).max(50) as unknown as string,
    confirmPassword: z.string().min(8).max(50) as unknown as string,
});