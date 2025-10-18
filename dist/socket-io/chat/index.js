"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const validation_1 = require("../validation");
const sendMessage = (socket, io, connectedUsers) => {
    return (data) => {
        const destSocketId = connectedUsers.get(data.destId);
        (0, validation_1.validateMessage)(data);
        if (!destSocketId) {
            socket.emit("errorMessage", "User not found");
            return;
        }
        socket.emit("successMessage", data);
        io.to(destSocketId).emit("receiveMessage", data);
    };
};
exports.sendMessage = sendMessage;
