import { z } from "zod";
import { GENDER } from "../../utils";
import { UpdateUserDto } from "./userUpdate.dto";

export const updateUserSchema = z.object<UpdateUserDto>({
    fullName: z.string().min(3).max(50) as unknown as string,
    phoneNumber: z.string().length(11).regex(/^(\+20|0020|0)?1[0125][0-9]{8}$/) as unknown as string,
    gender: z.enum(GENDER) as unknown as GENDER,
});