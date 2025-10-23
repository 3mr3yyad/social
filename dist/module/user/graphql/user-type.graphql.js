"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResponse = exports.userType = void 0;
const graphql_1 = require("graphql");
exports.userType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        fristName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
        fullName: { type: graphql_1.GraphQLString },
        profilePicture: { type: graphql_1.GraphQLString },
        createdAt: { type: graphql_1.GraphQLString, resolve: (parent) => new Date(parent.createdAt).toISOString() },
        updatedAt: { type: graphql_1.GraphQLString, resolve: (parent) => new Date(parent.updatedAt).toISOString() },
    }
});
exports.userResponse = new graphql_1.GraphQLObjectType({
    name: "UserResponse",
    fields: {
        success: { type: graphql_1.GraphQLBoolean },
        message: { type: graphql_1.GraphQLString },
        data: { type: new graphql_1.GraphQLList(exports.userType) },
    }
});
