import { Router } from "express";
import AuthService from "./auth.service";
import { isValid } from "../../middleware/validation.middleware";
import * as authValidation from "./auth.validation";

const router = Router();

router.post("/register", isValid(authValidation.registerSchema), AuthService.register)
router.post("/login", isValid(authValidation.loginSchema), AuthService.login)
router.post("/two-step-verification", AuthService.twoStepVerification)
router.post("/verify-email", AuthService.verifyEmail)
export default router;
