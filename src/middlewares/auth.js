"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const types_1 = require("@/types");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const user_mapper_1 = require("@/utils/user.mapper");
const jwt_1 = require("@/utils/jwt");
const userIncludeRoles = { roles: true };
async function loadAuthUser(id) {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        include: userIncludeRoles,
    });
    if (!user) {
        throw new types_1.AppError("User not found", 404);
    }
    return (0, user_mapper_1.toAuthUser)(user);
}
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new types_1.AppError("Token de autenticação não informado", 401);
        }
        const token = authHeader.slice('Bearer '.length).trim();
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = await loadAuthUser(payload.sub);
        next();
    }
    catch (error) {
        if (error instanceof types_1.AppError) {
            next(error);
            return;
        }
        next(new types_1.AppError("Erro ao autenticar usuário", 401));
    }
}
function authorize(...roles) {
    return (req, res, next) => {
        try {
            if (!req.user) {
                next(new types_1.AppError("Usuário não autenticado", 401));
                return;
            }
            if (roles.length > 0 && !(0, types_1.hasAnyRole)(req.user, roles)) {
                next(new types_1.AppError("Sem permissão para este recurso", 403));
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=auth.js.map