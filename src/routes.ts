import express from 'express';
import * as authController from './controllers/auth/authController';
import * as userController from './controllers/user/userController';
import * as taskController from './controllers/task/taskController';
import { authenticateToken } from './middleware/validateTokenMiddleware';

//
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Rotas de autenticação
 *   - name: User
 *     description: Rotas de usuário
 *   - name: Task
 *     description: Rotas de tarefas
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - email
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jsonwebtoken"
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "johndoe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     id:
 *                       type: string
 *                       example: "userId"
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
 *     tags:
 *       - Auth
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jsonwebtoken"
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "johndoe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     id:
 *                       type: string
 *                       example: "userId"
 *                     lastName:
 *                       type: string
 *                       nullable: true
 *                       example: "lastName"
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
 *     tags:
 *       - User
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "taskId"
 *                 name:
 *                   type: string
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 lastName:
 *                   type: string
 *                   example: "lastName"
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */

router.get('/user/:id', authenticateToken, userController.getUserController);

/**
 * @swagger
 * /user:
 *   put:
 *     tags:
 *       - User
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "taskId"
 *                 name:
 *                   type: string
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 lastName:
 *                   type: string
 *                   example: "lastName"
 *       400:
 *         description: Erro na requisição (validação dos dados)
 *       404:
 *         description: Usuário (userId) não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.put('/user', authenticateToken, userController.updateUserController);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags:
 *       - User
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
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.delete(
  '/user/:id',
  authenticateToken,
  userController.deleteUserController
);

/**
 * @swagger
 * /task:
 *   post:
 *     tags:
 *       - Task
 *     summary: Criar uma nova tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - status
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "userId"
 *               value:
 *                 type: string
 *                 example: "This is a task"
 *               status:
 *                 type: integer
 *                 enum:
 *                   - 1
 *                   - 2
 *                 example: 1
 *     responses:
 *       201:
 *         description: Task criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "taskId"
 *                 userId:
 *                   type: string
 *                   example: "userId"
 *                 value:
 *                   type: string
 *                   example: "This is a task"
 *                 status:
 *                   type: integer
 *                   enum: [1, 2]
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-08-01T12:34:56Z"
 *                 createdBy:
 *                   type: string
 *                   example: "creatorUserId"
 *                 updateAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-08-02T12:34:56Z"
 *                 updateBy:
 *                   type: string
 *                   example: "updaterUserId"
 *       400:
 *         description: Erro na requisição (validação dos dados)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado (para o userId passado)
 *       500:
 *         description: Erro interno
 */
router.post('/task', authenticateToken, taskController.createTaskController);

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     tags:
 *       - Task
 *     summary: Consultar os dados da tarefa pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID da tarefa
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         description: O status da tarefa (1 ou 2)
 *     responses:
 *       200:
 *         description: Informações da tarefa retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "taskId"
 *                 userId:
 *                   type: string
 *                   example: "userId"
 *                 value:
 *                   type: string
 *                   example: "This is a task"
 *                 status:
 *                   type: integer
 *                   enum: [1, 2]
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-08-01T12:34:56Z"
 *                 createdBy:
 *                   type: string
 *                   example: "creatorUserId"
 *                 updateAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-08-02T12:34:56Z"
 *                 updateBy:
 *                   type: string
 *                   example: "updaterUserId"
 *       404:
 *         description: Tarefa não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.get(
  '/task/:userId',
  authenticateToken,
  taskController.getTaskByUserIdController
);

/**
 * @swagger
 * /task:
 *   put:
 *     tags:
 *       - Task
 *     summary: Editar uma tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - value
 *              - status
 *              - userId
 *              - id
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "userId"
 *               id:
 *                 type: string
 *                 example: "taskId"
 *               value:
 *                 type: string
 *                 example: "This a task"
 *               status:
 *                 type: integer
 *                 enum:
 *                   - 1
 *                   - 2
 *                 example: 1
 *     responses:
 *       200:
 *         description: Task atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "taskId"
 *                 value:
 *                   type: string
 *                   example: "This is a task"
 *                 status:
 *                   type: integer
 *                   enum: [1, 2]
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-08-01T12:34:56Z"
 *                 createdBy:
 *                   type: string
 *                   example: "creatorUserId"
 *                 updateAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-08-02T12:34:56Z"
 *                 updateBy:
 *                   type: string
 *                   example: "updaterUserId"
 *       400:
 *         description: Erro na requisição (validação dos dados)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno
 */
router.put('/task', authenticateToken, taskController.updateTaskController);

/**
 * @swagger
 * /task/{id}/{userId}:
 *   delete:
 *     tags:
 *       - Task
 *     summary: Deletar uma tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Id da tarefa
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: Id do usuário atrelado a tarefa
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
router.delete(
  '/task/:id/:userId',
  authenticateToken,
  taskController.deleteTaskController
);

export default router;
