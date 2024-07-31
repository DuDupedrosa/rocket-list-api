"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskAsync = createTaskAsync;
exports.getTaskByUserIdAsync = getTaskByUserIdAsync;
exports.updateTaskAsync = updateTaskAsync;
exports.deleteTaskAsync = deleteTaskAsync;
const createTaskValidatorSchema_1 = require("../../validatorSchemas/task/createTaskValidatorSchema");
const validatorSchemaResponse_1 = require("../../helpers/methods/validatorSchemaResponse");
const userModel_1 = __importDefault(require("../../models/user/userModel"));
const responseModel_1 = require("../../helpers/methods/responseModel");
const StatusCodeEnum_1 = require("../../helpers/enums/StatusCodeEnum");
const uuid_1 = require("uuid");
const taskModel_1 = require("../../models/task/taskModel");
const updateTaskValidatorSchema_1 = require("../../validatorSchemas/task/updateTaskValidatorSchema");
function createTaskAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = createTaskValidatorSchema_1.createTaskValidatorSchema.validate(req.body);
            if (error) {
                return (0, validatorSchemaResponse_1.validatorSchemaResponse)({ req, res, error });
            }
            const { userId, value, status } = req.body;
            //  1 - existe o userId
            const user = yield userModel_1.default.findOne({ id: userId });
            if (!user) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    message: 'Not found user by id',
                    status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                });
            }
            let taskData = {
                id: (0, uuid_1.v4)(),
                value,
                status,
                userId,
                createdAt: new Date(),
                createdBy: userId,
                updateAt: new Date(),
                updateBy: userId,
            };
            const createdTask = yield taskModel_1.taskModel.create(taskData);
            if (!createdTask) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                    message: `createTaskAsync|erroOnCreateTaskModel`,
                });
            }
            return (0, responseModel_1.responseModel)({
                req,
                res,
                content: createdTask,
                status: StatusCodeEnum_1.statusCodeEnum.CREATED,
            });
        }
        catch (err) {
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                message: `createTaskAsync|${err}`,
            });
        }
    });
}
function getTaskByUserIdAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const { status } = req.query;
            const user = yield userModel_1.default.findOne({ id: userId });
            if (!user) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    message: `Not found user by id`,
                    status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                });
            }
            let tasks;
            if (!status) {
                tasks = yield taskModel_1.taskModel.find({ userId: user.id });
            }
            else {
                tasks = yield taskModel_1.taskModel.find({ userId: user.id, status });
            }
            return (0, responseModel_1.responseModel)({
                req,
                res,
                content: tasks,
                status: StatusCodeEnum_1.statusCodeEnum.SUCCESS,
            });
        }
        catch (err) {
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                message: `getTaskByStatusAsync|${err}`,
            });
        }
    });
}
function updateTaskAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = updateTaskValidatorSchema_1.updateTaskValidatorSchema.validate(req.body);
            if (error) {
                return (0, validatorSchemaResponse_1.validatorSchemaResponse)({ req, res, error });
            }
            const { userId, id, value, status } = req.body;
            const task = yield taskModel_1.taskModel.findOne({ id });
            if (!task) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                    message: 'Not found task by id or br user id',
                });
            }
            // validando se o usuário não está tentando editar a task de outro usuário
            if (task.userId !== userId) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.UNAUTHORIZED,
                    message: `User not allowed to do this action`,
                });
            }
            const updatedTask = yield taskModel_1.taskModel.findOneAndUpdate({ id }, {
                value,
                status,
                updateAt: new Date(),
            }, { runValidators: true, new: true });
            if (!updatedTask) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                    message: `updateTaskAsync|ErrorOnUpdateTaskModel`,
                });
            }
            let response = {
                id,
                value: updatedTask.value,
                status: updatedTask.status,
                updateAt: updatedTask.updateAt,
                createdAt: updatedTask.createdAt,
                createdBy: updatedTask.createdBy,
                updateBy: updatedTask.updateBy,
            };
            return (0, responseModel_1.responseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.SUCCESS,
                content: response,
            });
        }
        catch (err) {
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                message: `updateTaskAsync|${err}`,
            });
        }
    });
}
function deleteTaskAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, userId } = req.params;
            const task = yield taskModel_1.taskModel.findOne({ id });
            if (!task) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                    message: 'Not found task by id',
                });
            }
            // validando se o usuário não está tentando deletar a task de outro usuário
            if (task.userId !== userId) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.UNAUTHORIZED,
                    message: `User not allowed to do this action`,
                });
            }
            const deletedTask = yield taskModel_1.taskModel.findOneAndDelete({ id });
            if (!deletedTask) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                    message: 'deleteTaskAsync|ErrorOnDeleteTaskModel',
                });
            }
            return (0, responseModel_1.responseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.SUCCESS,
                content: '',
            });
        }
        catch (err) {
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                message: `deleteTaskAsync|${err}`,
            });
        }
    });
}
