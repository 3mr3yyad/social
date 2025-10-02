import { CommentRepository, PostRepository } from "../../../DB";
import { NotFoundException } from "../../error";

export const addReactionProvider = async (
    repo: CommentRepository | PostRepository,
    id: string,
    reaction: string,
    userId: string
) => {
    const postExists = await repo.exists({ _id: id });
    
            if (!postExists) {
                throw new NotFoundException("Post not found");
            }
    
            let userReactionIndex = postExists.reactions.findIndex((reaction) => {
                return reaction.userId.toString() == userId.toString()
            })
    
            if (userReactionIndex == -1) {
                await repo.update(
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
                await repo.update(
                    { _id: id },
                    { $pull: { reactions: postExists.reactions[userReactionIndex] } })
            }
            else {
                await repo.update(
                    { _id: id, "reactions.userId": userId },
                    { "reactions.$.reaction": reaction })
            }
}