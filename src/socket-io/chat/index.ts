import { Server, Socket } from "socket.io";
import { validateMessage } from "../validation";
import { ChatRepository, MessageRepository } from "../../DB";
import { ObjectId } from "mongoose";

export const sendMessage = (socket: Socket, io: Server, connectedUsers: Map<string, string>) => {
    return async (data: { message: string, destId: string }) => {
            const destSocketId = connectedUsers.get(data.destId);
            validateMessage(data);
            if (!destSocketId) {
                socket.emit("errorMessage", "User not found");
                return;
            }
            socket.emit("successMessage", data)
        io.to(destSocketId).emit("receiveMessage", data)
        
        const messageRepository = new MessageRepository()
        const senderId = socket.data.user.id
        const createdMessage = await messageRepository.create({
            content: data.message,
            senderId,
            
        })
        const chatRepository = new ChatRepository()
        const chat = await chatRepository.getOne({ users: { $all: [senderId, data.destId] } })
        if (!chat) {
            await chatRepository.create({
                users: [senderId, data.destId],
                messages: [createdMessage._id as ObjectId]
            })
        }else{
            await chatRepository.update(
                { _id: chat._id },
                { $push: { messages: createdMessage._id} })
        }
    }
}
