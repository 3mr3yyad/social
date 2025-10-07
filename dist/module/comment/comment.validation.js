"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidation = void 0;
const zod_1 = require("zod");
exports.commentValidation = zod_1.z.object({
    content: zod_1.z.string().min(1).max(280),
    // TODO: attachments validation
});
