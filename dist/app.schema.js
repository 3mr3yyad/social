"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appSchema = void 0;
const graphql_1 = require("graphql");
const query_1 = require("./module/post/graphql/query");
const query_2 = require("./module/user/graphql/query");
const query_3 = require("./module/comment/graphql/query");
let query = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        ...query_1.postQuery,
        ...query_2.userQuery,
        ...query_3.commentQuery
    }
});
exports.appSchema = new graphql_1.GraphQLSchema({
    query,
});
