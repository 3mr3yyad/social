"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const post_schema_1 = require("./post.schema");
exports.Post = (0, mongoose_1.model)("Post", post_schema_1.postSchema);
