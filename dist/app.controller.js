"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootStrap = bootStrap;
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const connection_1 = require("./DB/connection");
const errorHandler_1 = require("./utils/error/errorHandler");
function bootStrap(app, express) {
    (0, connection_1.connectDB)();
    app.use(express.json());
    // auth
    app.use("/auth", auth_controller_1.default);
    app.use("/{*dummy}", (req, res) => {
        return res.status(404).send({ message: "Not Found", success: false });
    });
    app.use(errorHandler_1.errorHandler);
}
