"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmailSchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.updateUserSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(50),
    phoneNumber: zod_1.z.string().length(11).regex(/^(\+20|0020|0)?1[0125][0-9]{8}$/),
    gender: zod_1.z.enum(utils_1.GENDER),
});
exports.updateEmailSchema = zod_1.z.object({
    email: zod_1.z.email(),
    otp: zod_1.z.string().length(5),
    expiryTime: zod_1.z.date(),
});
