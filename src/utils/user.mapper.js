"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuthUser = toAuthUser;
exports.toPublicUser = toPublicUser;
const types_1 = require("@/types");
function mapRoleNames(roles) {
    return roles
        .map(role => role.name)
        .filter((name) => Object.values(types_1.UserRole).includes(name));
}
function toAuthUser(user) {
    return {
        id: user.id,
        username: user.name,
        email: user.email,
        roles: mapRoleNames(user.roles),
    };
}
function toPublicUser(user) {
    return {
        id: user.id,
        username: user.name,
        email: user.email,
        roles: mapRoleNames(user.roles),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}
//# sourceMappingURL=user.mapper.js.map