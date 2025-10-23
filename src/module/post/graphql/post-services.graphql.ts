import { NotFoundException } from "../../../utils";
import { PostRepository } from "../../../DB";
import { isAuthenticatedGraphql, isValidGraphql } from "../../../middleware";
import { postValidation } from "./post-validation.graphql";

export const getSpecificPost = async (parent: any, args: { id: string }) => {
    isValidGraphql(postValidation, args)
    const postRepo = new PostRepository()
    const post = await postRepo.getOne(
        { _id: args.id },
        {},
        { populate: [{ path: "userId", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] })
    if (!post) {
        throw new NotFoundException("Post not found")
    }
    return {
        success: true,
        message: "done",
        data: post
    }
}       

export const getAllPosts = async (parent: any, args: any, context: any) => {
    await isAuthenticatedGraphql(context)
    const postRepo = new PostRepository()
    const posts = await postRepo.getAll(
        {},
        {},
        { populate: [{ path: "userId", select: "fristName lastName fullName profilePicture createdAt updatedAt" }] })
    return {
        success: true,
        message: "done",
        data: posts
    }
}

