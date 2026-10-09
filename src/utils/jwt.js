"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../types/index");
function signToken(user) {
    const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
    };
    const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    const options = {
        expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
    };
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
}
function verifyToken(token) {
    const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jsonwebtoken_1.default.verify(token, secretKey);
    if (typeof decoded === 'string'
        || !decoded
        || typeof decoded !== 'object') {
        throw new Error('Invalid token');
    }
    const payload = decoded;
    if (!payload.sub || !payload.email) {
        throw new Error('Invalid token payload');
    }
    const roles = Array.isArray(payload.roles)
        ? payload.roles
        : payload.role &&
            Object.values(index_1.UserRole).includes(payload.role)
            ? [payload.role]
            : [];
    return {
        sub: payload.sub,
        email: payload.email,
        roles
    };
}
//# sourceMappingURL=jwt.js.map