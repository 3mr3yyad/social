import { Schema } from "mongoose";
import { IComment } from "../../../utils";
import { reactionSchema } from "../common";

export const commentSchema = new Schema<IComment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        parentId: {
            type: [Schema.Types.ObjectId],
            ref: "Comment",
            default: []
        },
        content: {
            type: String,
            required: function() {
                if (this.attachments?.length) {
                    return false;
                } else {
                    return true;
                };
            }
        },
        attachments: [
            {
                id: String,
                url: String
            }
        ],
        reactions: {
            type: [reactionSchema]
        }
    },
    { timestamps: true })
