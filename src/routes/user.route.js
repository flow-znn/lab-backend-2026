"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("@/controllers/user.controller");
const auth_1 = require("@/middlewares/auth");
// import { authenticate, authorize } from "@/middlewares/auth.middleware";
// import { UserRole } from "@/types";
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// router.use(authenticate);
router.get("/", userController.getAllUsers);
router.get("/:id", auth_1.authenticate, userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", auth_1.authenticate, userController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map