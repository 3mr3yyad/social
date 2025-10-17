import { z } from "zod";
import { GENDER } from "../../utils";
import { LoginDto, RegisterDto } from "./auth.dto";

export const registerSchema = z.object<RegisterDto>({
    fullName: z.string().min(3).max(50) as unknown as string,
    email: z.email() as unknown as string,
    phoneNumber: z.string().length(11).regex(/^\+201[0125][0-9]{8}$/).optional() as unknown as string,
    password: z.string().min(8).max(50) as unknown as string,
    gender: z.enum(GENDER) as unknown as GENDER,
});

export const loginSchema = z.object<LoginDto>({
    email: z.email() as unknown as string,
    password: z.string().min(8).max(50) as unknown as string,
});

