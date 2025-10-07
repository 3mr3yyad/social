"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const post_service_1 = __importDefault(require("./post.service"));
const __1 = require("..");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const post_validation_1 = require("./post.validation");
const router = (0, express_1.Router)();
router.use("/:postId/comment", __1.commentRouter);
router.post("/", (0, auth_middleware_1.isAuthenticated)(), (0, validation_middleware_1.isValid)(post_validation_1.postValidation), post_service_1.default.createPost);
router.patch("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.addReaction);
router.get("/:id", post_service_1.default.getSpacificPost);
router.delete("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.deletePost);
exports.default = router;
