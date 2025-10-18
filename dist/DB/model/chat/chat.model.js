"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chat_schema_1 = require("./chat.schema");
exports.Chat = (0, mongoose_1.model)("Chat", chat_schema_1.chatSchema);
