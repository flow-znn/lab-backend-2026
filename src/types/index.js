"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.USER_ROLE_VALUES = exports.UserRole = void 0;
exports.hasRole = hasRole;
exports.hasAnyRole = hasAnyRole;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
    UserRole["GUEST"] = "GUEST";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.USER_ROLE_VALUES = Object.values(UserRole);
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function hasRole(user, role) {
    return Boolean(user?.roles?.includes(role));
}
function hasAnyRole(user, roles) {
    if (!user?.roles?.length)
        return false;
    if (roles.length === 0)
        return true;
    return roles.some(role => user.roles.includes(role));
}
//# sourceMappingURL=index.js.map