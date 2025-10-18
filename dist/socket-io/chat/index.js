"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const validation_1 = require("../validation");
const DB_1 = require("../../DB");
const sendMessage = (socket, io, connectedUsers) => {
    return async (data) => {
        const destSocketId = connectedUsers.get(data.destId);
        (0, validation_1.validateMessage)(data);
        if (!destSocketId) {
            socket.emit("errorMessage", "User not found");
            return;
        }
        socket.emit("successMessage", data);
        io.to(destSocketId).emit("receiveMessage", data);
        // show online status to friends
        const userRepository = new DB_1.UserRepository();
        const friends = await userRepository.getOne({ _id: socket.data.user.id }, { friends: 1 });
        if (!friends)
            return;
        const friendSocketIds = (friends.friends ?? [])
            .map((friend) => connectedUsers.get(friend.toString()))
            .filter((id) => !!id);
        if (friendSocketIds.length) {
            io.to(friendSocketIds).emit("online", socket.data.user.id);
        }
        // save message
        const messageRepository = new DB_1.MessageRepository();
        const senderId = socket.data.user.id;
        const createdMessage = await messageRepository.create({
            content: data.message,
            senderId,
        });
        const chatRepository = new DB_1.ChatRepository();
        const chat = await chatRepository.getOne({ users: { $all: [senderId, data.destId] } });
        if (!chat) {
            await chatRepository.create({
                users: [senderId, data.destId],
                messages: [createdMessage._id]
            });
        }
        else {
            await chatRepository.update({ _id: chat._id }, { $push: { messages: createdMessage._id } });
        }
        // show typing status to dest user
        io.to(destSocketId).emit("typing", socket.data.user.id);
    };
};
exports.sendMessage = sendMessage;
