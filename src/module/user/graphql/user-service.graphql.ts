import { isAuthenticatedGraphql, isValidGraphql } from "../../../middleware"
import { UserRepository } from "../../../DB"
import { NotFoundException, verifyToken } from "../../../utils"
import { userValidation } from "./user-validation"

export const getFriendList = async (parent: any, args: any, context: any) => {
    const { _id } = verifyToken(context.token)
    isValidGraphql(userValidation, _id)
    await isAuthenticatedGraphql(context)
    const userInfo = context.user

    const userRepository = new UserRepository()
    const user = await userRepository.getOne(
        { _id: userInfo._id },
        {},
        { populate: [{ path: "friends", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] })
    if (!user) {
        throw new NotFoundException("User not found")
    }
    if (user!.friends!.length === 0) {
        throw new NotFoundException("User has no friends")
    }
    const friends = user!.friends
    return {
        success: true,
        message: "done",
        data: friends
    }
}

export const getFriendsRequest = async (parent: any, args: any, context: any) => {
    const { _id } = verifyToken(context.token)
    isValidGraphql(userValidation, _id)
    await isAuthenticatedGraphql(context)
    const userInfo = context.user

    const userRepository = new UserRepository()
    const user = await userRepository.getOne(
        { _id: userInfo._id },
        {},
        { populate: [{ path: "friendsRequest", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] })
    if (!user) {
        throw new NotFoundException("User not found")
    }
    if (user!.friendsRequest!.length === 0) {
        throw new NotFoundException("User has no friends request")
    }
    const friendsRequest = user!.friendsRequest
    return {
        success: true,
        message: "done",
        data: friendsRequest
    }
}