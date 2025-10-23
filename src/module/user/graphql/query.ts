import { GraphQLID } from "graphql";
import { getFriendList, getFriendsRequest } from "./user-service.graphql";
import { userResponse } from "./user-type.graphql";

export const userQuery = {  
    getFriends: {
        type: userResponse,
        args: {
            id: {type: GraphQLID},
        },
        resolve: getFriendList,
    },
    getFriendsRequest: {
        type: userResponse,
        resolve: getFriendsRequest,
    },
}   