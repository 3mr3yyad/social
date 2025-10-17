import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "./middleware";

export const initSocketIo = (server: HttpServer) => {
    const io = new Server(server, { cors: { origin: "*" } });
    io.use(socketAuth)

    io.on("connection", (socket: Socket) => {
        console.log("new user connected");
    });

}
