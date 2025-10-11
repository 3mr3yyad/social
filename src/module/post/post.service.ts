import { Request, Response } from "express";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB";
import { addReactionProvider, NotFoundException, UnauthorizedException } from "../../utils";

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
        const userId = req.user!._id.toString();

        await addReactionProvider(this.postRepository, id!, reaction, userId)
    
        return res.sendStatus(204)
    }

    public getSpacificPost = async (req: Request, res: Response) => {
        const { id } = req.params;
        const post = await this.postRepository.getOne({ _id: id },
            {},
            {
                populate: [
                    { path: "userId", select: "fullName fristName lastName profilePicture" },
                    { path: "reactions.userId", select: "fullName fristName lastName profilePicture" },
                    { path: "comments", match: { parentId: undefined } }
                ]
            });
        
        if (!post) {
            throw new NotFoundException("Post not found");
        }

        if (post.frozen && post.userId.toString() == req.user!._id.toString()) {
            return res.status(200).json({ message: "frozen by you", success: true, data: { post } })
        }

        if (post.frozen) {
            throw new NotFoundException("Post not found");
        }

        return res.status(200).json({ success: true, data:{post} })
    }

    public freezePost = async (req: Request, res: Response) => {
        const { id } = req.params;
        const postExists = await this.postRepository.exists({ _id: id });
        if (!postExists) {
            throw new NotFoundException("Post not found");
        }
        if (postExists.userId.toString() != req.user!._id.toString()) {
            throw new UnauthorizedException("You are not authorized to freeze this post");
        }
        if (postExists.frozen) {
            throw new UnauthorizedException("Post is already frozen");
        }
        await this.postRepository.update({ _id: id }, { frozen: true });
        return res.status(200).json({ success: true, message: "Post frozen successfully" })
    }

    public unfreezePost = async (req: Request, res: Response) => {
        const { id } = req.params;
        const postExists = await this.postRepository.exists({ _id: id });
        if (!postExists) {
            throw new NotFoundException("Post not found");
        }
        if (postExists.userId.toString() != req.user!._id.toString()) {
            throw new UnauthorizedException("You are not authorized to unfreeze this post");
        }
        if (!postExists.frozen) {
            throw new UnauthorizedException("Post is not frozen");
        }
        await this.postRepository.update({ _id: id }, { frozen: false, deletedAt: null });
        return res.status(200).json({ success: true, message: "Post unfrozen successfully" })
    }

    public deletePost = async (req: Request, res: Response) => {
        const { id } = req.params;
        const postExists = await this.postRepository.exists({ _id: id });
        if (!postExists) {
            throw new NotFoundException("Post not found");
        }
        if (postExists.userId.toString() != req.user!._id.toString()) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }
        await this.postRepository.delete({ _id: id });
        return res.status(200).json({ success: true, message: "Post deleted with comments successfully" })
    }

    public updatePost = async (req: Request, res: Response) => {
        const { id } = req.params;
        const updatePostDTO: UpdatePostDTO = req.body;
        const postExists = await this.postRepository.exists({ _id: id });
        if (!postExists) {
            throw new NotFoundException("Post not found");
        }
        if (postExists.userId.toString() != req.user!._id.toString()) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }
        await this.postRepository.update({ _id: id }, { content: updatePostDTO.content });
        return res.status(200).json({ success: true, message: "Post updated successfully" })
    }
}

export default new PostService()
