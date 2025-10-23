"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGraphql = void 0;
const utils_1 = require("../utils");
const isValidGraphql = (schema, args) => {
    let data = args;
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
        let errMessage = validationResult.error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message
        }));
        throw new utils_1.BadRequestException(JSON.stringify(errMessage));
    }
};
exports.isValidGraphql = isValidGraphql;
