"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskValidatorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const TaskEnum_1 = require("../../helpers/enums/TaskEnum");
exports.createTaskValidatorSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    value: joi_1.default.string().required(),
    status: joi_1.default.number()
        .valid(TaskEnum_1.taskStatusEnum.PENDING, TaskEnum_1.taskStatusEnum.COMPLETED)
        .required(),
    //createdAt: Joi.date().required(),
    //updateAt: Joi.date().required(),
});
