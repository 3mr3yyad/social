import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

export const userType = new GraphQLObjectType({
    name: "User",
    fields: {
        _id: { type: GraphQLID },
        fristName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        fullName: { type: GraphQLString },
        profilePicture: { type: GraphQLString },
        createdAt: { type: GraphQLString, resolve: (parent) => new Date(parent.createdAt).toISOString() },
        updatedAt: { type: GraphQLString, resolve: (parent) => new Date(parent.updatedAt).toISOString() },
    }
})

export const userResponse = new GraphQLObjectType({
    name: "UserResponse",
    fields: {
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        data: { type: new GraphQLList(userType) },
    }
})

