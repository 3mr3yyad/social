"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
exports.commentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment"
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
        }
    },
    attachments: [
        {
            id: String,
            url: String
        }
    ],
    reactions: {
        type: [common_1.reactionSchema]
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.commentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentId"
});
exports.commentSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    const replies = await this.model.find({ parentId: filter._id });
    if (replies.length) {
        for (const reply of replies) {
            await this.model.deleteOne({ _id: reply._id });
        }
    }
    next();
});
