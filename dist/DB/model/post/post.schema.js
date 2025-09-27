"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
exports.postSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: function () {
            if (this.attachments?.length) {
                return false;
            }
            else {
                return true;
            }
            ;
        },
        trim: true
    },
    reactions: [common_1.reactionSchema]
}, { timestamps: true });
