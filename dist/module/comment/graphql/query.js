"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentQuery = void 0;
const graphql_1 = require("graphql");
const comment_type_graphql_1 = require("./comment-type.graphql");
const comment_service_graphql_1 = require("./comment-service.graphql");
exports.commentQuery = {
    getComment: {
        type: comment_type_graphql_1.commentResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
        },
        resolve: comment_service_graphql_1.getSpecificComment,
    },
    getAllCommentsOfPost: {
        type: comment_type_graphql_1.commentsListResponse,
        args: {
            postId: { type: graphql_1.GraphQLID },
        },
        resolve: comment_service_graphql_1.getAllCommentsOfPost,
    }
};
