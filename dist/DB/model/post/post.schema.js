"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const comment_model_1 = require("../comment/comment.model");
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.postSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "postId"
});
exports.postSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    comment_model_1.Comment.deleteMany({ postId: filter._id });
    next();
});
