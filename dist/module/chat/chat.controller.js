"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const chat_service_1 = __importDefault(require("./chat.service"));
const router = (0, express_1.Router)();
router.get("/:userId", (0, auth_middleware_1.isAuthenticated)(), chat_service_1.default.getChat);
exports.default = router;
