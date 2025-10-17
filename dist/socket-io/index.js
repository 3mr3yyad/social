"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketIo = void 0;
const socket_io_1 = require("socket.io");
const middleware_1 = require("./middleware");
const validation_1 = require("./validation");
const connectedUsers = new Map();
const initSocketIo = (server) => {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    io.use(middleware_1.socketAuth);
    io.on("connection", (socket) => {
        connectedUsers.set(socket.data.user.id, socket.id);
        console.log(connectedUsers, "connectedUsers");
        socket.on("sendMessage", (data) => {
            const destSocketId = connectedUsers.get(data.destId);
            (0, validation_1.validateMessage)(data);
            if (!destSocketId) {
                socket.emit("errorMessage", "User not found");
                return;
            }
            socket.emit("successMessage", data);
            io.to(destSocketId).emit("receiveMessage", data);
        });
    });
};
exports.initSocketIo = initSocketIo;
