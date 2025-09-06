"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_controller_1 = require("./app.controller");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "./config/dev.env" });
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, app_controller_1.bootStrap)(app, express_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
