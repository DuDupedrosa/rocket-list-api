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
exports.userRegisterAsync = userRegisterAsync;
const StatusCodeEnum_1 = require("../../helpers/enums/StatusCodeEnum");
const userModel_1 = __importDefault(require("../../models/user/userModel"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
function userRegisterAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body == null) {
                return res
                    .status(StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST)
                    .json({ message: `Request body can't be null` });
            }
            const { email, name, password } = req.body;
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            let newUser = {
                email,
                name,
                password: hashedPassword,
                id: (0, uuid_1.v4)(),
            };
            if (!newUser.id) {
                return res.status(StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST).json({
                    message: 'A user id is required',
                    statusCode: StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST,
                });
            }
            const createdUser = yield userModel_1.default.create(newUser);
            const response = {
                name,
                email,
                id: newUser.id,
            };
            return res
                .status(StatusCodeEnum_1.statusCodeEnum.CREATED)
                .json({ content: response, statusCode: StatusCodeEnum_1.statusCodeEnum.CREATED });
        }
        catch (err) {
            return res.status(StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO).json({
                message: `userRegisterAsync|${err}`,
                statusCode: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
            });
        }
    });
}
