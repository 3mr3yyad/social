import { Router } from "express";
import userService from "./user.service";
import { isValid } from "../../middleware/validation.middleware";
import * as userValidation from "./user.validation";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();

router.get("/getBlockList", isAuthenticated(), userService.getBlockList);
router.get("/:id", userService.getProfile);
router.put("/updateProfile", isValid(userValidation.updateUserSchema), isAuthenticated(), userService.updateProfile);
router.put("/updateEmailVerification", isAuthenticated(), userService.updateEmailVerification);
router.put("/updateEmail", isValid(userValidation.updateEmailSchema),isAuthenticated(), userService.updateEmail);
router.put("/updateTwoStepVerification", isAuthenticated(), userService.updateTwoStepVerification);
router.put("/updatePassword", isValid(userValidation.updatePasswordSchema),isAuthenticated(), userService.updatePassword);
router.put("/blockUser/:id", isAuthenticated(), userService.blockUser);
router.put("/unblockUser/:id", isAuthenticated(), userService.unblockUser);

router.post("/sendFriendRequest/:id", isAuthenticated(), userService.sendFriendRequest);
router.post("/acceptFriendRequest/:id", isAuthenticated(), userService.acceptFriendRequest);
router.post("/rejectFriendRequest/:id", isAuthenticated(), userService.rejectFriendRequest);
router.post("/removeFriend/:id", isAuthenticated(), userService.removeFriend);

export default router;
