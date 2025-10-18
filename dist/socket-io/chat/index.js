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
    };
};
exports.sendMessage = sendMessage;
