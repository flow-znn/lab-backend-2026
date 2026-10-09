"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("@/services/auth.service");
const user_mapper_1 = require("@/utils/user.mapper");
class AuthController {
    authService;
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const { token, user } = await this.authService.login({ email, password });
            res.json({ token, user: (0, user_mapper_1.toPublicUser)(user) });
        }
        catch (error) {
            res.status(401).json(error);
        }
    };
    me = async (req, res) => {
        try {
            const user = await this.authService.me(req.user.id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.json((0, user_mapper_1.toPublicUser)(user));
        }
        catch (error) {
            res.status(404).json(error);
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map