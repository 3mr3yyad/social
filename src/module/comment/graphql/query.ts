import { GraphQLID } from "graphql";
import { commentResponse, commentsListResponse } from "./comment-type.graphql";
import { getAllCommentsOfPost, getSpecificComment } from "./comment-service.graphql";

export const commentQuery = {
    getComment: {
        type: commentResponse,
        args: {
            id: {type: GraphQLID},
        },
        resolve: getSpecificComment,
    },
    getAllCommentsOfPost: {
        type: commentsListResponse,
        args: {
            postId: {type: GraphQLID},
        },
        resolve: getAllCommentsOfPost,
    }
}