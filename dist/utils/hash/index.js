"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.generateHash = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateHash = (plainText) => {
    return bcryptjs_1.default.hashSync(plainText, 10);
};
exports.generateHash = generateHash;
const compareHash = (password, hashPassword) => {
    return bcryptjs_1.default.compareSync(password, hashPassword);
};
exports.compareHash = compareHash;
