import { Router } from "express";
import { routeHelper } from "../../utils";
import { authenticateUser, authenticate } from "../../utils/middleware/auth";
import * as userController from "./user-controller";

const router = Router();

router.post("/login", (req, res) => routeHelper({ req, res, controller: userController.userLogin }));

router.post("/change-password", authenticateUser,(req, res) => {
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

router.post("/logout", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: userController.userLogout });
});

router.post("/create-user", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: userController.createUser });
});

router.get("/get-users", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: userController.getUsers });
});

router.post("/update-user/:userId", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: userController.updateUser});
});

router.get("/view-user/:userId", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: userController.viewUser });
});

router.get("/view-profile", authenticateUser, (req, res) => {
    routeHelper({ req, res, controller: userController.viewUserProfile });
});


export default router