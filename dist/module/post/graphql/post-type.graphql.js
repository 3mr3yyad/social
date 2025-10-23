"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsListResponse = exports.postResponse = exports.postType = void 0;
const graphql_1 = require("graphql");
const user_type_graphql_1 = require("../../user/graphql/user-type.graphql");
exports.postType = new graphql_1.GraphQLObjectType({
    name: "Post",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        userId: {
            type: user_type_graphql_1.userType
        },
        createdAt: { type: graphql_1.GraphQLString, resolve: (parent) => new Date(parent.createdAt).toISOString() },
        updatedAt: { type: graphql_1.GraphQLString, resolve: (parent) => new Date(parent.updatedAt).toISOString() },
    }
});
exports.postResponse = new graphql_1.GraphQLObjectType({
    name: "PostResponse",
    fields: {
        success: { type: graphql_1.GraphQLBoolean },
        message: { type: graphql_1.GraphQLString },
        data: { type: exports.postType },
    }
});
exports.postsListResponse = new graphql_1.GraphQLObjectType({
    name: "PostsListResponse",
    fields: {
        success: { type: graphql_1.GraphQLBoolean },
        message: { type: graphql_1.GraphQLString },
        data: { type: new graphql_1.GraphQLList(exports.postType) },
    }
});
