import { ObjectId } from "mongoose";
import { IReaction } from "../../../utils";

export class Post {
    postId!: ObjectId;
    userId!: ObjectId;
    content!: string;
    reactions!: IReaction[];
    attachment?: any[]; // TODO
    
}