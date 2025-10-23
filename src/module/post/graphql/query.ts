import { GraphQLID } from "graphql"
import { postResponse, postsListResponse } from "./post-type.graphql"
import { getSpecificPost, getAllPosts } from "./post-services.graphql"

export const postQuery = {
    getPost: {
        type: postResponse,
        args: {
            id: {type: GraphQLID},
        },
        resolve: getSpecificPost,
    },
    getAllPosts: {
        type: postsListResponse,
        args: {
            id: {type: GraphQLID},
        },
        resolve: getAllPosts,
    }
}   