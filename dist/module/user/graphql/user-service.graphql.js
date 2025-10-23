"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendsRequest = exports.getFriendList = void 0;
const middleware_1 = require("../../../middleware");
const DB_1 = require("../../../DB");
const utils_1 = require("../../../utils");
const user_validation_1 = require("./user-validation");
const getFriendList = async (parent, args, context) => {
    const { _id } = (0, utils_1.verifyToken)(context.token);
    (0, middleware_1.isValidGraphql)(user_validation_1.userValidation, _id);
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    const userInfo = context.user;
    const userRepository = new DB_1.UserRepository();
    const user = await userRepository.getOne({ _id: userInfo._id }, {}, { populate: [{ path: "friends", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] });
    if (!user) {
        throw new utils_1.NotFoundException("User not found");
    }
    if (user.friends.length === 0) {
        throw new utils_1.NotFoundException("User has no friends");
    }
    const friends = user.friends;
    return {
        success: true,
        message: "done",
        data: friends
    };
};
exports.getFriendList = getFriendList;
const getFriendsRequest = async (parent, args, context) => {
    const { _id } = (0, utils_1.verifyToken)(context.token);
    (0, middleware_1.isValidGraphql)(user_validation_1.userValidation, _id);
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    const userInfo = context.user;
    const userRepository = new DB_1.UserRepository();
    const user = await userRepository.getOne({ _id: userInfo._id }, {}, { populate: [{ path: "friendsRequest", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] });
    if (!user) {
        throw new utils_1.NotFoundException("User not found");
    }
    if (user.friendsRequest.length === 0) {
        throw new utils_1.NotFoundException("User has no friends request");
    }
    const friendsRequest = user.friendsRequest;
    return {
        success: true,
        message: "done",
        data: friendsRequest
    };
};
exports.getFriendsRequest = getFriendsRequest;
