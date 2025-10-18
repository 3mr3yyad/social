import { Server, Socket } from "socket.io";
import { validateMessage } from "../validation";

export const sendMessage = (socket: Socket, io: Server, connectedUsers: Map<string, string>) => {
    return (data: { message: string, destId: string }) => {
            const destSocketId = connectedUsers.get(data.destId);
            validateMessage(data);
            if (!destSocketId) {
                socket.emit("errorMessage", "User not found");
                return;
            }
            socket.emit("successMessage", data)
            io.to(destSocketId).emit("receiveMessage", data)
        }
}
