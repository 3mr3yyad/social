"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const utils_1 = require("../utils");
const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.query, ...req.params };
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
            let errMessage = validationResult.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }));
            throw new utils_1.BadRequestException("Validation failed", errMessage);
        }
        return next();
    };
};
exports.isValid = isValid;
