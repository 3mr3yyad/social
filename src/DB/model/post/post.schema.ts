import { Schema } from "mongoose";
import { IPost, IReaction, REACTION } from "../../../utils";

const reactionSchema = new Schema<IReaction>({
    reaction: {
        type: Number,
        enum: REACTION,
        default: REACTION.like
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{ timestamps: true , _id: false })

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
        reactions:[reactionSchema]
    },
    { timestamps: true }
);
