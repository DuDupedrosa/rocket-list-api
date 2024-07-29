"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegisterValidatorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userRegisterValidatorSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    lastName: joi_1.default.string().allow(null),
    password: joi_1.default.string().min(8).required(),
    email: joi_1.default.string().email().required(),
});
