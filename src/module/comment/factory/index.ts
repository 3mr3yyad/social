import { IComment, IPost, IUser } from "../../../utils";
import { CreateCommentDTO } from "../comment.dto";
import { Comment } from "../entity";

export class CommentFactoryService {
    createComment(createCommentDTO: CreateCommentDTO, userId: IUser, post: IPost, comment?: IComment) {
        const newComment = new Comment();

        newComment.content = createCommentDTO.content;
        newComment.userId = userId._id;
        newComment.postId = post._id || comment!.postId;
        newComment.parentId = comment?._id; 
        newComment.reactions = [];

        return newComment;
    }
}

