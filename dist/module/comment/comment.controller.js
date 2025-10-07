"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const comment_service_1 = __importDefault(require("./comment.service"));
const comment_validation_1 = require("./comment.validation");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("{/:id}", (0, validation_middleware_1.isValid)(comment_validation_1.commentValidation), (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.create);
router.get("/:id", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.getSpecific);
router.delete("/:id", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.deleteComment);
router.patch("/:id", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.addReaction);
exports.default = router;
