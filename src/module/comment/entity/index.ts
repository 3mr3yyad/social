import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utils";

export class Comment {
    userId!: ObjectId;
    postId!: ObjectId;
    parentId!: ObjectId[];
    content!: string;
    attachments?: IAttachment[];
    reactions!: IReaction[];
}
