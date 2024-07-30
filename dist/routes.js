"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController = __importStar(require("./controllers/auth/authController"));
const userController = __importStar(require("./controllers/user/userController"));
const taskController = __importStar(require("./controllers/task/taskController"));
const validateTokenMiddleware_1 = require("./middleware/validateTokenMiddleware");
//
const router = express_1.default.Router();
//auth
router.post('/auth/register', authController.userRegisterController);
router.post('/auth/signin', authController.userSignInController);
//user-profile - required auth
router.get('/user/:id', validateTokenMiddleware_1.authenticateToken, userController.getUserController);
router.put('/user', validateTokenMiddleware_1.authenticateToken, userController.updateUserController);
router.delete('/user/:id', validateTokenMiddleware_1.authenticateToken, userController.deleteUserController);
//tasks
router.post('/task', validateTokenMiddleware_1.authenticateToken, taskController.createTaskController);
router.get('/task/:userId', validateTokenMiddleware_1.authenticateToken, taskController.getTaskByUserIdController);
exports.default = router;
