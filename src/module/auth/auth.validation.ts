import { z } from "zod";
import { GENDER } from "../../utils";
import { RegisterDto } from "./auth.dto";

export const registerSchema = z.object<RegisterDto>({
    fullName: z.string().min(3).max(50) as unknown as string,
    email: z.email() as unknown as string,
    phoneNumber: z.string().length(11) as unknown as string,
    password: z.string().min(8).max(50) as unknown as string,
    gender: z.enum(GENDER) as unknown as GENDER,
});
