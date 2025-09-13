import type { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utils";
import { ZodType } from "zod";

export const isValid = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let data = {...req.body, ...req.query, ...req.params}
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
            let errMessage = validationResult.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }))
            throw new BadRequestException("Validation failed", errMessage);
        }
    }
}
