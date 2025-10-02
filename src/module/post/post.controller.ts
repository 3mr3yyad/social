import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import PostService from "./post.service";
import { commentRouter } from "..";

const router = Router()

router.use("/:postId/comment", commentRouter)
router.post("/", isAuthenticated(), PostService.createPost)
router.patch("/:id", isAuthenticated(), PostService.addReaction)
router.get("/:id", PostService.getSpacificPost)
router.delete("/:id", isAuthenticated(), PostService.deletePost)

export default router
