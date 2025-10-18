import { Schema } from "mongoose";
import { IMessage } from "../../../utils";

export const messageSchema = new Schema<IMessage>({
    content: {
        type: String,
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reactions: {
        type: [Schema.Types.ObjectId],
        ref: "Reaction",
        default: []
    },
    attachments: {
        type: [Schema.Types.ObjectId],
        ref: "Attachment",
        default: []
    }
}, {
    timestamps: true
});
