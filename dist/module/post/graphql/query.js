"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQuery = void 0;
const graphql_1 = require("graphql");
const post_type_graphql_1 = require("./post-type.graphql");
const post_services_graphql_1 = require("./post-services.graphql");
exports.postQuery = {
    getPost: {
        type: post_type_graphql_1.postResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
        },
        resolve: post_services_graphql_1.getSpecificPost,
    },
    getAllPosts: {
        type: post_type_graphql_1.postsListResponse,
        args: {
            id: { type: graphql_1.GraphQLID },
        },
        resolve: post_services_graphql_1.getAllPosts,
    }
};
