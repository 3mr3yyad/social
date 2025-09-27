"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentFactoryService = void 0;
const entity_1 = require("../entity");
class CommentFactoryService {
    createComment(createCommentDTO, userId, post, comment) {
        const newComment = new entity_1.Comment();
        newComment.content = createCommentDTO.content;
        newComment.userId = userId._id;
        newComment.postId = post._id;
        newComment.parentId = comment ? [...comment.parentId, comment._id] : [];
        newComment.reactions = [];
        return newComment;
    }
}
exports.CommentFactoryService = CommentFactoryService;
