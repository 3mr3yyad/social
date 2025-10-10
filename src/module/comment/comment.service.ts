import { CommentRepository, PostRepository } from "../../DB";
import { addReactionProvider, IComment, IPost, NotFoundException, UnauthorizedException, verifyToken } from "../../utils";
import { Request, Response } from "express";
import {CommentFactoryService} from "./factory";
import { CreateCommentDTO } from "./comment.dto";
import { ObjectId } from "mongoose";

class CommentService {
    private readonly postRepository = new PostRepository();
    private readonly commentRepository = new CommentRepository();
    private readonly commentFactoryService = new CommentFactoryService();

    public create = async (req: Request, res: Response) => {
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

    public getSpecific = async (req: Request, res: Response) => {
        const { id } = req.params;
        const currentUser = verifyToken(req.headers.authorization!)._id as unknown as ObjectId;
        const comment = await this.commentRepository.getOne({ _id: id }, {},
            {populate: [
                { path: "replies", match: { parentId: id }, select: "fullName fristName lastName profilePicture" }
            ]
            });

        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        if (comment.deletedAt && comment.userId.toString() == currentUser.toString()) {
            return res.status(200).json({ message: "frozen by you", success: true, data: { comment } })
        }

        if (comment.deletedAt) {
            throw new NotFoundException("Comment not found");
        }

        return res.status(200).json({ success: true, data: { comment } })
    }

    public freezeComment = async (req: Request, res: Response) => {
        const { id } = req.params;
        const commentExists = await this.commentRepository.exists({ _id: id }, {},
            {populate: [
                { path: "postId", select: "userId" }
            ]}
        );
        if (!commentExists) {
            throw new NotFoundException("Comment not found");
        }
        if (![commentExists.userId.toString(), 
        (commentExists.postId as unknown as IPost).userId.toString()].includes(req.user!._id.toString())) {
            throw new UnauthorizedException("You are not authorized to freeze this comment");
        }
        await this.commentRepository.update({ _id: id }, { deletedAt: Date.now() });
        return res.status(200).json({ success: true, message: "Comment frozen successfully" })
    }

    public deleteComment = async (req: Request, res: Response) => {
        const { id } = req.params;
        const commentExists = await this.commentRepository.exists({ _id: id }, {},
            {populate: [
                { path: "postId", select: "userId" }
            ]}
        );
        if (!commentExists) {
            throw new NotFoundException("Comment not found");
        }
        if (![commentExists.userId.toString(), 
        (commentExists.postId as unknown as IPost).userId.toString()].includes(req.user!._id.toString())) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }
        await this.commentRepository.delete({ _id: id });
        return res.status(200).json({ success: true, message: "Comment deleted with replies successfully" })
    }

    public updateComment = async (req: Request, res: Response) => {
        const { id } = req.params;
        const updateCommentDTO: CreateCommentDTO = req.body;
        const commentExists = await this.commentRepository.exists({ _id: id }, {},
            {populate: [
                { path: "postId", select: "userId" }
            ]}
        );
        if (!commentExists) {
            throw new NotFoundException("Comment not found");
        }
        if (![commentExists.userId.toString(), 
        (commentExists.postId as unknown as IPost).userId.toString()].includes(req.user!._id.toString())) {
            throw new UnauthorizedException("You are not authorized to update this comment");
        }
        await this.commentRepository.update({ _id: id }, { content: updateCommentDTO.content });
        return res.status(200).json({ success: true, message: "Comment updated successfully" })
    }

    public addReaction = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user!._id.toString();

        await addReactionProvider(this.commentRepository, id!, reaction, userId)
    
        return res.sendStatus(204)
    }
}

export default new CommentService()
