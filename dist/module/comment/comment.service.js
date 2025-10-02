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
        const comment = await this.commentRepository.getOne({ _id: id }, {}, { populate: [
                { path: "replies", match: { parentId: id }, select: "fullName fristName lastName profilePicture" }
            ] });
        if (!comment) {
            throw new utils_1.NotFoundException("Comment not found");
        }
        return res.status(200).json({ success: true, data: { comment } });
    };
    deleteComment = async (req, res) => {
        const { id } = req.params;
        const commentExists = await this.commentRepository.exists({ _id: id }, {}, { populate: [
                { path: "postId", select: "userId" }
            ] });
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
}
exports.default = new CommentService();
