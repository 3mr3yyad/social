import { Server, Socket } from "socket.io";
import { validateMessage } from "../validation";
import { ChatRepository, MessageRepository, UserRepository } from "../../DB";
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

        // show online status to friends
        const userRepository = new UserRepository()
        const friends = await userRepository.getOne({ _id: socket.data.user.id }, { friends: 1 })

        if (!friends) return;

        const friendSocketIds = (friends.friends ?? [])
            .map((friend) => connectedUsers.get(friend.toString()))
            .filter((id): id is string => !!id)

        if (friendSocketIds.length) {
            io.to(friendSocketIds).emit("online", socket.data.user.id)
        }

        // save message
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

        // show typing status to dest user
        io.to(destSocketId).emit("typing", socket.data.user.id)
    }
}
