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
            console.log(postId);
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
}
exports.default = new CommentService();
