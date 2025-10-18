"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.messageSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reactions: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Reaction",
        default: []
    },
    attachments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Attachment",
        default: []
    }
}, {
    timestamps: true
});
