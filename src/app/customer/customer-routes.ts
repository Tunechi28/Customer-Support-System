import { Router } from "express";
import { routeHelper } from "../../utils";
import * as userController from "./customer-controller";
import { authenticate} from "../../utils/middleware/auth";

const router = Router();

router.post("/login", (req, res) => {
    routeHelper({ req, res, controller: userController.customerLogin });
});

router.post("/signup", (req, res) => {
    routeHelper({ req, res, controller: userController.customerSignup });
});

router.post("/change-password", authenticate, (req, res) => {
    routeHelper({ req, res, controller: userController.changePassword });
});

router.post("/request-password-reset", (req, res) => {
    routeHelper({ req, res, controller: userController.requestPasswordReset });
});

router.post("/validate-password-reset", (req, res) => {
    routeHelper({ req, res, controller: userController.validatePasswordResetToken });
});

router.post("/reset-password", (req, res) => {
    routeHelper({ req, res, controller: userController.resetPassword });
});

router.post("/logout", authenticate, (req, res) => {
    routeHelper({ req, res, controller: userController.customerLogout });
});

router.patch("/update-profile", authenticate, (req, res) => {
    routeHelper({ req, res, controller: userController.updateProfile });
});

router.post("/delete-profile", authenticate, (req, res) => {
    routeHelper({ req, res, controller: userController.deleteProfile });
});

router.get("/profile", authenticate, (req, res) => {
    routeHelper({ req, res, controller: userController.findProfile });
});

export default router;
