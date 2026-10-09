"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const ticket_route_1 = __importDefault(require("./ticket.route"));
const routes = (0, express_1.Router)();
routes.use("/users", user_route_1.default);
routes.use("/auth", auth_route_1.default);
routes.use("/tickets", ticket_route_1.default);
routes.get("/", (req, res) => {
    res.json({ message: "Store API - Node.js + Express + TypeScript" });
});
exports.default = routes;
//# sourceMappingURL=index.js.map