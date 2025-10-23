import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { postQuery } from "./module/post/graphql/query";
import { userQuery } from "./module/user/graphql/query";
import { commentQuery } from "./module/comment/graphql/query";

let query = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        ...postQuery,
        ...userQuery,
        ...commentQuery
    }
})

export const appSchema = new GraphQLSchema({
    query,
})