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
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - name
 *              - password
 *              - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               lastName:
 *                 type: string
 *                 example: "lastName"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro na requisição (validação dos dados)
 *       500:
 *         description: Erro interno
 */
router.post('/auth/register', authController.userRegisterController);
/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Efetuar login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - password
 *              - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Usuário logado com sucesso
 *       400:
 *         description: Erro na requisição (validação dos dados)
 *       404:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno
 */
router.post('/auth/signin', authController.userSignInController);
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Consultar os dados do usuário pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informações do usuário retornadas com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno
 */
router.get('/user/:id', validateTokenMiddleware_1.authenticateToken, userController.getUserController);
/**
 * @swagger
 * /user:
 *   put:
 *     summary: Editar os dados do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - name
 *              - email
 *              - id
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               id:
 *                 type: string
 *                 example: "userId"
 *               name:
 *                 type: string
 *                 example: "johndoe"
 *               lastName:
 *                 type: string
 *                 example: "lastName"
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 *       400:
 *         description: Erro na requisição (validação dos dados)
 *       404:
 *         description: Usuário (userId) não encontrado
 *       500:
 *         description: Erro interno
 */
router.put('/user', validateTokenMiddleware_1.authenticateToken, userController.updateUserController);
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Deletar a conta do usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário (userId) não encontrado
 *       500:
 *         description: Erro interno
 */
router.delete('/user/:id', validateTokenMiddleware_1.authenticateToken, userController.deleteUserController);
//tasks
router.post('/task', validateTokenMiddleware_1.authenticateToken, taskController.createTaskController);
router.get('/task/:userId', validateTokenMiddleware_1.authenticateToken, taskController.getTaskByUserIdController);
router.put('/task', validateTokenMiddleware_1.authenticateToken, taskController.updateTaskController);
router.delete('/task/:id/:userId', validateTokenMiddleware_1.authenticateToken, taskController.deleteTaskController);
exports.default = router;
