"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
const reactionSchema = new mongoose_1.Schema({
    reaction: {
        type: Number,
        enum: utils_1.REACTION,
        default: utils_1.REACTION.like
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true, _id: false });
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
    reactions: [reactionSchema]
}, { timestamps: true });
