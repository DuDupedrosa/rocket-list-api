import express from 'express';
import * as authController from './controllers/auth/authController';
import * as userController from './controllers/user/userController';
import * as taskController from './controllers/task/taskController';
import { authenticateToken } from './middleware/validateTokenMiddleware';

//
const router = express.Router();

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
router.get('/user/:id', authenticateToken, userController.getUserController);

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
router.put('/user', authenticateToken, userController.updateUserController);

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
router.delete(
  '/user/:id',
  authenticateToken,
  userController.deleteUserController
);

//tasks
router.post('/task', authenticateToken, taskController.createTaskController);
router.get(
  '/task/:userId',
  authenticateToken,
  taskController.getTaskByUserIdController
);
router.put('/task', authenticateToken, taskController.updateTaskController);
router.delete(
  '/task/:id/:userId',
  authenticateToken,
  taskController.deleteTaskController
);

export default router;
