import { Router } from "express";
import userService from "./user.service";
import { isValid } from "../../middleware/validation.middleware";
import * as userValidation from "./userUpdate.validation";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();

router.get("/:id", userService.getProfile);
router.put("/:id", isValid(userValidation.updateUserSchema),isAuthenticated(), userService.updateProfile);

export default router;
