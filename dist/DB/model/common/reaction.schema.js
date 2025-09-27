"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
exports.reactionSchema = new mongoose_1.Schema({
    reaction: {
        type: Number,
        enum: utils_1.REACTION,
        set: (value) => Number(value) || utils_1.REACTION.like
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true, _id: false });
