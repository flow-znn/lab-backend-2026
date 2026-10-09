"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = require("@/controllers/ticket.controller");
const auth_1 = require("@/middlewares/auth");
const types_1 = require("@/types");
const router = (0, express_1.Router)();
const controller = new ticket_controller_1.TicketController();
router.use(auth_1.authenticate);
router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.patch("/:id/status", (0, auth_1.authorize)(types_1.UserRole.ADMIN), controller.updateStatus);
exports.default = router;
//# sourceMappingURL=ticket.route.js.map