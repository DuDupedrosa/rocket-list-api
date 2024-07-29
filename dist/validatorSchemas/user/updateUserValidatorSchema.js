"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidatorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateUserValidatorSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    name: joi_1.default.string().required(),
    id: joi_1.default.string().required(),
    lastName: joi_1.default.string().allow(null),
});
