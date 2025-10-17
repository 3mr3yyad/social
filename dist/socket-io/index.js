"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketIo = void 0;
const socket_io_1 = require("socket.io");
const middleware_1 = require("./middleware");
const initSocketIo = (server) => {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    io.use(middleware_1.socketAuth);
    io.on("connection", (socket) => {
        console.log("new user connected");
    });
};
exports.initSocketIo = initSocketIo;
