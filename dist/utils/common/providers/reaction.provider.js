"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReactionProvider = void 0;
const error_1 = require("../../error");
const addReactionProvider = async (repo, id, reaction, userId) => {
    const postExists = await repo.exists({ _id: id });
    if (!postExists) {
        throw new error_1.NotFoundException("Post not found");
    }
    let userReactionIndex = postExists.reactions.findIndex((reaction) => {
        return reaction.userId.toString() == userId.toString();
    });
    if (userReactionIndex == -1) {
        await repo.update({ _id: id }, {
            $push: {
                reactions: {
                    reaction,
                    userId
                }
            }
        });
    }
    else if ([undefined, null, ""].includes(reaction)) {
        await repo.update({ _id: id }, { $pull: { reactions: postExists.reactions[userReactionIndex] } });
    }
    else {
        await repo.update({ _id: id, "reactions.userId": userId }, { "reactions.$.reaction": reaction });
    }
};
exports.addReactionProvider = addReactionProvider;
