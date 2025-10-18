import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "./middleware";
import { sendMessage } from "./chat";

const connectedUsers = new Map<string, string>();

export const initSocketIo = (server: HttpServer) => {
    const io = new Server(server, { cors: { origin: "*" } });
    io.use(socketAuth)

    io.on("connection", (socket: Socket) => {
        connectedUsers.set(socket.data.user.id, socket.id);
        console.log(connectedUsers, "connectedUsers");
        socket.on("sendMessage", sendMessage(socket, io, connectedUsers))
    });

}
