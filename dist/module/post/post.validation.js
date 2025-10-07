"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidation = void 0;
const zod_1 = require("zod");
exports.postValidation = zod_1.z.object({
    content: zod_1.z.string().min(1).max(280),
    // TODO: attachment validation
});
