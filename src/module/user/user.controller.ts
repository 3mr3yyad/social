import { Router } from "express";
import userService from "./user.service";
import { isValid } from "../../middleware/validation.middleware";
import * as userValidation from "./userUpdate.validation";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();

router.get("/:id", userService.getProfile);
router.put("/updateProfile/:id", isValid(userValidation.updateUserSchema),isAuthenticated(), userService.updateProfile);
router.put("/updateEmail/:id", isValid(userValidation.updateEmailSchema),isAuthenticated(), userService.updateEmail);
router.put("/updateTwoStepVerification/:id", isAuthenticated(), userService.updateTwoStepVerification);
router.put("/updatePassword/:id", isValid(userValidation.updatePasswordSchema),isAuthenticated(), userService.updatePassword);

export default router;
