import { Schema } from "mongoose";
import { IReaction, REACTION } from "../../../utils";

export const reactionSchema = new Schema<IReaction>({
    reaction: {
        type: Number,
        enum: REACTION,
        set: (value:any) => Number(value) || REACTION.like
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{ timestamps: true , _id: false })