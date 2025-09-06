"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const _1 = require(".");
function errorHandler(err, req, res, next) {
    if (err instanceof _1.AppError) {
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
