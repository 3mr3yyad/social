import { isValidGraphql } from "../../../middleware"
import { commentValidation } from "./comment-validation.graphql"
import { CommentRepository } from "../../../DB"
import { NotFoundException } from "../../../utils"

export const getSpecificComment = async (parent: any, args: { id: string }) => {
    isValidGraphql(commentValidation, args)
    const commentRepo = new CommentRepository()
    const comment = await commentRepo.getOne(
        { _id: args.id },
        {},
        { populate: [{ path: "userId", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] })
    if (!comment) {
        throw new NotFoundException("Comment not found")
    }
    return {
        success: true,
        message: "done",
        data: comment
    }
}

export const getAllCommentsOfPost = async (parent: any, args: { postId: string }) => {
    isValidGraphql(commentValidation, args)
    const commentRepo = new CommentRepository()
    const comments = await commentRepo.getAll(
        { postId: args.postId },
        {},
        { populate: [{ path: "userId", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] })
    return {
        success: true,
        message: "done",
        data: comments
    }
}