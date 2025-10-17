import { z } from "zod";

export const validateMessage = (data: { message: string, destId: string }) => {
    z.object({
        message: z.string().min(1).max(280),
        destId: z.string().length(24),
    }).parse(data);
}