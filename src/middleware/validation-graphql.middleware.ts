import type { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utils";
import { ZodType } from "zod";

export const isValidGraphql = (schema: ZodType, args: any) => {

        let data = args
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
            let errMessage = validationResult.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }))
            throw new BadRequestException(JSON.stringify(errMessage));
        }
    }
