import z from "zod";

export const commentValidation = z.object({
    id: z.string().length(24).regex(/^[0-9a-fA-F]{24}$/).optional(),
    postId: z.string().length(24).regex(/^[0-9a-fA-F]{24}$/).optional(),
}).refine((data) => data.id && !data.postId || !data.id && data.postId, { message: "id and postId are required" })
