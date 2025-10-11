import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import PostService from "./post.service";
import { commentRouter } from "..";
import { isValid } from "../../middleware/validation.middleware";
import { postValidation } from "./post.validation";

const router = Router()

router.use("/:postId/comment", commentRouter)
router.post("/", isAuthenticated(), isValid(postValidation), PostService.createPost)
router.patch("/:id", isAuthenticated(), PostService.addReaction)
router.get("/:id", PostService.getSpacificPost)
router.delete("/:id", isAuthenticated(), PostService.deletePost)
router.patch("/freeze/:id", isAuthenticated(), PostService.freezePost)
router.patch("/unfreeze/:id", isAuthenticated(), PostService.unfreezePost)
router.patch("/update/:id", isAuthenticated(), isValid(postValidation), PostService.updatePost)

export default router
