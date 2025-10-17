"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessage = void 0;
const zod_1 = require("zod");
const validateMessage = (data) => {
    zod_1.z.object({
        message: zod_1.z.string().min(1).max(280),
        destId: zod_1.z.string().length(24),
    }).parse(data);
};
exports.validateMessage = validateMessage;
