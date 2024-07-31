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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskController = createTaskController;
exports.getTaskByUserIdController = getTaskByUserIdController;
exports.updateTaskController = updateTaskController;
exports.deleteTaskController = deleteTaskController;
const taskService_1 = require("../../services/task/taskService");
function createTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, taskService_1.createTaskAsync)(req, res);
    });
}
function getTaskByUserIdController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, taskService_1.getTaskByUserIdAsync)(req, res);
    });
}
function updateTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, taskService_1.updateTaskAsync)(req, res);
    });
}
function deleteTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, taskService_1.deleteTaskAsync)(req, res);
    });
}
