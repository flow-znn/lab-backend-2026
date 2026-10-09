"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("@/services/user.service");
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    getAllUsers = async (req, res) => {
        try {
            const { page, limit, q, orderBy } = req.query;
            const users = await this.userService.getAllUsers({
                page: Number(page),
                limit: Number(limit),
                where: q,
                orderBy,
            });
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    };
    getUserById = async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching user', error });
        }
    };
    createUser = async (req, res) => {
        try {
            const userData = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        }
        catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    };
    updateUser = async (req, res) => {
        try {
            const userId = req.params.id;
            const userData = req.body;
            const updatedUser = await this.userService.updateUser(userId, userData);
            if (updatedUser) {
                res.status(200).json(updatedUser);
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    };
    deleteUser = async (req, res) => {
        try {
            const userId = req.params.id;
            const deleted = await this.userService.deleteUser(userId);
            if (deleted) {
                res.status(200).json({ message: 'User deleted successfully' });
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    };
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map