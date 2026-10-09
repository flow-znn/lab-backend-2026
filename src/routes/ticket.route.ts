import { Router } from "express";
import { TicketController } from "@/controllers/ticket.controller";
import { authenticate, authorize } from "@/middlewares/auth";
import { UserRole } from "@/types";

const router = Router();
const controller = new TicketController();

router.use(authenticate);
router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.patch("/:id/status", authorize(UserRole.ADMIN), controller.updateStatus);

export default router;
