"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.devConfig = {
    // # DB
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT,
    // # email
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    // # JWT
    JWT_SECRET: process.env.JWT_SECRET,
};
