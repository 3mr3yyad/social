import z from "zod";

export const userValidation = z.string().length(24).regex(/^[0-9a-fA-F]{24}$/);
