"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.getSpecificPost = void 0;
const utils_1 = require("../../../utils");
const DB_1 = require("../../../DB");
const middleware_1 = require("../../../middleware");
const post_validation_graphql_1 = require("./post-validation.graphql");
const getSpecificPost = async (parent, args) => {
    (0, middleware_1.isValidGraphql)(post_validation_graphql_1.postValidation, args);
    const postRepo = new DB_1.PostRepository();
    const post = await postRepo.getOne({ _id: args.id }, {}, { populate: [{ path: "userId", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] });
    if (!post) {
        throw new utils_1.NotFoundException("Post not found");
    }
    return {
        success: true,
        message: "done",
        data: post
    };
};
exports.getSpecificPost = getSpecificPost;
const getAllPosts = async (parent, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    const postRepo = new DB_1.PostRepository();
    const posts = await postRepo.getAll({}, {}, { populate: [{ path: "userId", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] });
    return {
        success: true,
        message: "done",
        data: posts
    };
};
exports.getAllPosts = getAllPosts;
