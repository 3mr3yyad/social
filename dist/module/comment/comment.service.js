"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
class CommentService {
    postRepository = new DB_1.PostRepository();
    commentRepository = new DB_1.CommentRepository();
    commentFactoryService = new factory_1.CommentFactoryService();
    create = async (req, res) => {
        const { postId, id } = req.params;
        const createCommentDTO = req.body;
        const postExists = await this.postRepository.exists({ _id: postId });
        if (!postExists) {
            throw new utils_1.NotFoundException("Post not found");
        }
        let commentExists;
        if (id) {
            commentExists = await this.commentRepository.exists({ _id: id });
            if (!commentExists) {
                throw new utils_1.NotFoundException("Comment not found");
            }
        }
        const comment = this.commentFactoryService.createComment(createCommentDTO, req.user, postExists, commentExists);
        const createdComment = await this.commentRepository.create(comment);
        return res.status(201).json({ message: "Comment created successfully", success: true, data: { createdComment } });
    };
    getSpecific = async (req, res) => {
        const { id } = req.params;
        const currentUser = (0, utils_1.verifyToken)(req.headers.authorization)._id;
        const comment = await this.commentRepository.getOne({ _id: id }, {}, {
            populate: [
                { path: "replies", match: { parentId: id }, select: "fullName fristName lastName profilePicture" }
            ]
        });
        if (!comment) {
            throw new utils_1.NotFoundException("Comment not found");
        }
        const post = await this.postRepository.getOne({ _id: comment.postId }, {}, {});
        if (post?.frozen) {
            throw new utils_1.NotFoundException("Post is deleted");
        }
        const parentComment = await this.commentRepository.getOne({ _id: comment.parentId }, {}, {});
        if (parentComment?.frozen) {
            throw new utils_1.NotFoundException("Comment is deleted");
        }
        if (comment.frozen && comment.userId.toString() == currentUser.toString()) {
            return res.status(200).json({ message: "frozen by you", success: true, data: { comment } });
        }
        if (comment.frozen) {
            throw new utils_1.NotFoundException("Comment not found");
        }
        return res.status(200).json({ success: true, data: { comment } });
    };
    freezeComment = async (req, res) => {
        const { id } = req.params;
        const commentExists = await this.commentRepository.exists({ _id: id }, {}, {
            populate: [
                { path: "postId", select: "userId" }
            ]
        });
        if (!commentExists) {
            throw new utils_1.NotFoundException("Comment not found");
        }
        if (![commentExists.userId.toString(),
            commentExists.postId.userId.toString()].includes(req.user._id.toString())) {
            throw new utils_1.UnauthorizedException("You are not authorized to freeze this comment");
        }
        await this.commentRepository.update({ _id: id }, { deletedAt: Date.now(), frozen: true });
        await this.commentRepository.update({ parentId: id }, { deletedAt: Date.now(), frozen: true });
        return res.status(200).json({ success: true, message: "Comment frozen successfully" });
    };
    deleteComment = async (req, res) => {
        const { id } = req.params;
        const commentExists = await this.commentRepository.exists({ _id: id }, {}, {
            populate: [
                { path: "postId", select: "userId" }
            ]
        });
        if (!commentExists) {
            throw new utils_1.NotFoundException("Comment not found");
        }
        if (![commentExists.userId.toString(),
            commentExists.postId.userId.toString()].includes(req.user._id.toString())) {
            throw new utils_1.UnauthorizedException("You are not authorized to delete this comment");
        }
        await this.commentRepository.delete({ _id: id });
        return res.status(200).json({ success: true, message: "Comment deleted with replies successfully" });
    };
    updateComment = async (req, res) => {
        const { id } = req.params;
        const updateCommentDTO = req.body;
        const commentExists = await this.commentRepository.exists({ _id: id }, {}, {
            populate: [
                { path: "postId", select: "userId" }
            ]
        });
        if (!commentExists || commentExists.frozen) {
            throw new utils_1.NotFoundException("Comment not found");
        }
        if (![commentExists.userId.toString(),
            commentExists.postId.userId.toString()].includes(req.user._id.toString())) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this comment");
        }
        await this.commentRepository.update({ _id: id }, { content: updateCommentDTO.content });
        return res.status(200).json({ success: true, message: "Comment updated successfully" });
    };
    addReaction = async (req, res) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user._id.toString();
        const commentExists = await this.commentRepository.exists({ _id: id });
        if (!commentExists || commentExists.frozen) {
            throw new utils_1.NotFoundException("Comment not found");
        }
        await (0, utils_1.addReactionProvider)(this.commentRepository, id, reaction, userId);
        return res.sendStatus(204);
    };
}
exports.default = new CommentService();
