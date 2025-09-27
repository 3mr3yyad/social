import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB";
import { NotFoundException, REACTION } from "../../utils";

class PostService {
    private readonly postFactoryService = new PostFactoryService();
    private readonly postRepository = new PostRepository();

    public createPost = async (req: Request, res: Response) => {
        const createPostDTO: CreatePostDTO = req.body;

        const post = this.postFactoryService.createPost(createPostDTO, req.user)

        const createdPost = await this.postRepository.create(post)

        return res.status(201).json({ message: "Post created successfully", success: true, post: {createdPost} })
    }

    public addReaction = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user!._id;

        const postExists = await this.postRepository.exists({ _id: id });

        if (!postExists) {
            throw new NotFoundException("Post not found");
        }

        let userReactionIndex = postExists.reactions.findIndex((reaction) => {
            return reaction.userId.toString() == userId.toString()
        })

        if (userReactionIndex == -1) {
            await this.postRepository.update(
                { _id: id },
                {
                    $push: {
                        reactions: {
                            reaction,
                            userId
                        }
                    }
                })
        }
        else if ([undefined, null, ""].includes(reaction)) {
            await this.postRepository.update(
                { _id: id },
                { $pull: { reactions: postExists.reactions[userReactionIndex] } })
        }
        else {
            await this.postRepository.update(
                { _id: id, "reactions.userId": userId },
                { "reactions.$.reaction": reaction })
        }
    
        return res.sendStatus(204)
    }

    public getSpacificPost = async (req: Request, res: Response) => {
        const { id } = req.params;
        const post = await this.postRepository.getOne({ _id: id },
            {},
            {
                populate: [
                    { path: "userId", select: "fullName fristName lastName profilePicture" },
                    { path: "reactions.userId", select: "fullName fristName lastName profilePicture" }
                ]
            });

        if (!post) {
            throw new NotFoundException("Post not found");
        }

        return res.status(200).json({ success: true, data:{post} })
    }
}

export default new PostService()
