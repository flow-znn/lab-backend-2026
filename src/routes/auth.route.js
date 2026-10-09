"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("@/controllers/auth.controller");
const express_1 = require("express");
const auth_1 = require("@/middlewares/auth");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post("/login", authController.login);
router.get("/me", auth_1.authenticate, authController.me);
exports.default = router;
//# sourceMappingURL=auth.route.js.map