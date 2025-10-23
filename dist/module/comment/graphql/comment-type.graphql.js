"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsListResponse = exports.commentResponse = exports.commentType = void 0;
const graphql_1 = require("graphql");
const user_type_graphql_1 = require("../../user/graphql/user-type.graphql");
exports.commentType = new graphql_1.GraphQLObjectType({
    name: "Comment",
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
exports.commentResponse = new graphql_1.GraphQLObjectType({
    name: "CommentResponse",
    fields: {
        success: { type: graphql_1.GraphQLBoolean },
        message: { type: graphql_1.GraphQLString },
        data: { type: exports.commentType },
    }
});
exports.commentsListResponse = new graphql_1.GraphQLObjectType({
    name: "CommentsListResponse",
    fields: {
        success: { type: graphql_1.GraphQLBoolean },
        message: { type: graphql_1.GraphQLString },
        data: { type: new graphql_1.GraphQLList(exports.commentType) },
    }
});
