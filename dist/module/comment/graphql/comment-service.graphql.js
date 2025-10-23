"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCommentsOfPost = exports.getSpecificComment = void 0;
const middleware_1 = require("../../../middleware");
const comment_validation_graphql_1 = require("./comment-validation.graphql");
const DB_1 = require("../../../DB");
const utils_1 = require("../../../utils");
const getSpecificComment = async (parent, args) => {
    (0, middleware_1.isValidGraphql)(comment_validation_graphql_1.commentValidation, args);
    const commentRepo = new DB_1.CommentRepository();
    const comment = await commentRepo.getOne({ _id: args.id }, {}, { populate: [{ path: "userId", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] });
    if (!comment) {
        throw new utils_1.NotFoundException("Comment not found");
    }
    return {
        success: true,
        message: "done",
        data: comment
    };
};
exports.getSpecificComment = getSpecificComment;
const getAllCommentsOfPost = async (parent, args) => {
    (0, middleware_1.isValidGraphql)(comment_validation_graphql_1.commentValidation, args);
    const commentRepo = new DB_1.CommentRepository();
    const comments = await commentRepo.getAll({ postId: args.postId }, {}, { populate: [{ path: "userId", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] });
    return {
        success: true,
        message: "done",
        data: comments
    };
};
exports.getAllCommentsOfPost = getAllCommentsOfPost;
