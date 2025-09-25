"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const post_service_1 = __importDefault(require("./post.service"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.createPost);
router.patch("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.addReaction);
exports.default = router;
