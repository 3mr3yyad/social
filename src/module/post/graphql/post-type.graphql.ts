import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../../user/graphql/user-type.graphql";

export const postType = new GraphQLObjectType({
    name: "Post",
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

export const postResponse = new GraphQLObjectType({
    name: "PostResponse",
    fields: {
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        data: { type: postType },
    }
})

export const postsListResponse = new GraphQLObjectType({
    name: "PostsListResponse",
    fields: {
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        data: { type: new GraphQLList(postType) },
    }
})
