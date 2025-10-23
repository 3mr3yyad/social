import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../../user/graphql/user-type.graphql";

export const commentType = new GraphQLObjectType({
    name: "Comment",
    fields: {
        _id: { type: GraphQLID },
        content: { type: GraphQLString },
        userId: {
            type: userType
        },
        createdAt: { type: GraphQLString, resolve: (parent) => new Date(parent.createdAt).toISOString() },
        updatedAt: { type: GraphQLString, resolve: (parent) => new Date(parent.updatedAt).toISOString() },
    }
})

export const commentResponse = new GraphQLObjectType({
    name: "CommentResponse",
    fields: {
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        data: { type: commentType },
    }
})

export const commentsListResponse = new GraphQLObjectType({
    name: "CommentsListResponse",
    fields: {
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        data: { type: new GraphQLList(commentType) },
    }
})

