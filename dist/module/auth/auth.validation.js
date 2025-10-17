"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(50),
    email: zod_1.z.email(),
    phoneNumber: zod_1.z.string().length(11).regex(/^\+201[0125][0-9]{8}$/).optional(),
    password: zod_1.z.string().min(8).max(50),
    gender: zod_1.z.enum(utils_1.GENDER),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8).max(50),
});
