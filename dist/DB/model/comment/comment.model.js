"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const comment_schema_1 = require("./comment.schema");
exports.Comment = (0, mongoose_1.model)("Comment", comment_schema_1.commentSchema);
