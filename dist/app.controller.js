"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootStrap = bootStrap;
const express_1 = require("graphql-http/lib/use/express");
const DB_1 = require("./DB");
const module_1 = require("./module");
const app_schema_1 = require("./app.schema");
const cors_1 = __importDefault(require("cors"));
function bootStrap(app, express) {
    (0, DB_1.connectDB)();
    app.use(express.json());
    app.use((0, cors_1.default)({ origin: "*" }));
    // auth
    app.use("/auth", module_1.authRouter);
    // user
    app.use("/user", module_1.userRouter);
    // post
    app.use("/post", module_1.postRouter);
    // comment
    app.use("/comment", module_1.commentRouter);
    // chat
    app.use("/chat", module_1.chatRouter);
    // graphql
    app.all("/graphql", (0, express_1.createHandler)({
        schema: app_schema_1.appSchema,
        formatError: (err) => {
            return {
                message: err.message,
                success: false,
                path: err.path,
                errorDetails: err.originalError
            };
        },
        context: (req) => {
            const token = req.headers["authorization"];
            return { token };
        }
    }));
    app.use("/{*dummy}", (req, res) => {
        return res.status(404).send({ message: "Not Found", success: false });
    });
    app.use((error, req, res, next) => {
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message, success: false });
    });
}
