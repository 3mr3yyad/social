import { Request, Response, NextFunction } from "express";
import { AppError } from ".";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {

    if (err instanceof AppError) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }

    console.error("Unexpected Error:", err); 
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
