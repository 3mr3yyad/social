"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
class PostService {
    postFactoryService = new factory_1.PostFactoryService();
    postRepository = new DB_1.PostRepository();
    createPost = async (req, res) => {
        const createPostDTO = req.body;
        const post = this.postFactoryService.createPost(createPostDTO, req.user);
        const createdPost = await this.postRepository.create(post);
        return res.status(201).json({ message: "Post created successfully", success: true, post: { createdPost } });
    };
    addReaction = async (req, res) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user._id;
        const postExists = await this.postRepository.exists({ _id: id });
        if (!postExists) {
            throw new utils_1.NotFoundException("Post not found");
        }
        let userReactionIndex = postExists.reactions.findIndex((reaction) => {
            return reaction.userId.toString() == userId.toString();
        });
        if (userReactionIndex == -1) {
            await this.postRepository.update({ _id: id }, {
                $push: {
                    reactions: {
                        reaction,
                        userId
                    }
                }
            });
        }
        else if ([undefined, null, ""].includes(reaction)) {
            await this.postRepository.update({ _id: id }, { $pull: { reactions: postExists.reactions[userReactionIndex] } });
        }
        else {
            await this.postRepository.update({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction });
        }
        return res.sendStatus(204);
    };
    getSpacificPost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postRepository.getOne({ _id: id }, {}, {
            populate: [
                { path: "userId", select: "fullName fristName lastName profilePicture" },
                { path: "reactions.userId", select: "fullName fristName lastName profilePicture" },
                { path: "comments", match: { parentId: undefined } }
            ]
        });
        if (!post) {
            throw new utils_1.NotFoundException("Post not found");
        }
        return res.status(200).json({ success: true, data: { post } });
    };
    deletePost = async (req, res) => {
        const { id } = req.params;
        const postExists = await this.postRepository.exists({ _id: id });
        if (!postExists) {
            throw new utils_1.NotFoundException("Post not found");
        }
        if (postExists.userId.toString() != req.user._id.toString()) {
            throw new utils_1.UnauthorizedException("You are not authorized to delete this post");
        }
        await this.postRepository.delete({ _id: id });
        return res.status(200).json({ success: true, message: "Post deleted with comments successfully" });
    };
}
exports.default = new PostService();
