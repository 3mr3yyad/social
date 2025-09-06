"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    await mongoose_1.default
        .connect(process.env.DB_URL)
        .then(() => {
        console.log("DB connected successfully");
    })
        .catch((error) => {
        console.log({ message: "DB connection error", error });
    });
};
exports.connectDB = connectDB;
