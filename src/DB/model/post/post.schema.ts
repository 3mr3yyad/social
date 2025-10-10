import { Schema } from "mongoose";
import { IPost } from "../../../utils";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model";

export const postSchema = new Schema<IPost>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: function() {
                if (this.attachments?.length) {
                    return false;
                } else {
                    return true;
                };
            },
            trim: true
        },
        deletedAt: {
            type: Date,
            default: null
        },
        reactions:[reactionSchema]
    },
    { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true }}
);

postSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "postId"
});

postSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    Comment.deleteMany({ postId: filter._id });
    next();
});
