import { CommentRepository, PostRepository } from "../../DB";
import { IComment, NotFoundException } from "../../utils";
import { Request, Response } from "express";
import {CommentFactoryService} from "./factory";
import { CreateCommentDTO } from "./comment.dto";

class CommentService {
    private readonly postRepository = new PostRepository();
    private readonly commentRepository = new CommentRepository();
    private readonly commentFactoryService = new CommentFactoryService();

    create = async (req: Request, res: Response) => {
        const { postId, id } = req.params;
        const createCommentDTO: CreateCommentDTO = req.body;


        const postExists = await this.postRepository.exists({ _id: postId });

        if (!postExists) {
            throw new NotFoundException("Post not found");
        }

        let commentExists: IComment | null ;
        if (id) {
            commentExists = await this.commentRepository.exists({ _id: id });
            if (!commentExists) {
                throw new NotFoundException("Comment not found");
            }
        }
        const comment = this.commentFactoryService.createComment(
            createCommentDTO,
            req.user,
            postExists,
            commentExists!
        );
        const createdComment = await this.commentRepository.create(comment);
        return res.status(201).json({ message: "Comment created successfully", success: true, data: {createdComment} })
    }
}

export default new CommentService()
