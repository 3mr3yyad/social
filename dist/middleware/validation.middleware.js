"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const error_1 = require("../utils/error");
const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.query, ...req.params };
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
            let errMessage = validationResult.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }));
            throw new error_1.BadRequestException("Validation failed", errMessage);
        }
    };
};
exports.isValid = isValid;
