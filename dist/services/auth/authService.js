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
exports.userSignInAsync = userSignInAsync;
const StatusCodeEnum_1 = require("../../helpers/enums/StatusCodeEnum");
const userModel_1 = __importDefault(require("../../models/user/userModel"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const validateEmail_1 = require("../../helpers/validators/validateEmail");
const validatePassword_1 = require("../../helpers/validators/validatePassword");
const userRegisterValidatorSchema_1 = require("../../validatorSchemas/auth/userRegisterValidatorSchema");
const userSignInValidatorSchema_1 = require("../../validatorSchemas/auth/userSignInValidatorSchema");
const validatorSchemaResponse_1 = require("../../helpers/methods/validatorSchemaResponse");
const responseModel_1 = require("../../helpers/methods/responseModel");
dotenv_1.default.config();
const jwtSecretKey = process.env.JWT_TOKEN_SECRET_KEY
    ? process.env.JWT_TOKEN_SECRET_KEY
    : '';
function userRegisterAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // validating dto
            const { error, value } = userRegisterValidatorSchema_1.userRegisterValidatorSchema.validate(req.body);
            if (error) {
                return (0, validatorSchemaResponse_1.validatorSchemaResponse)({ req, res, error });
            }
            const { email, name, password, lastName } = req.body;
            // validating email
            if (!(0, validateEmail_1.validateEmail)(email)) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST,
                    message: 'Invalid e-mail.',
                });
            }
            // validating password
            // validatePassword return a true value or a object's error message
            if ((0, validatePassword_1.validatePassword)(password) !== true) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST,
                    message: (0, validatePassword_1.validatePassword)(password),
                });
            }
            // password to hash
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            let newUser = {
                email,
                name,
                password: hashedPassword,
                id: (0, uuid_1.v4)(),
                lastName,
            };
            // case uuid don't generate the user id
            if (!newUser.id) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST,
                    message: 'A user id is required',
                });
            }
            // create user in data base
            const createdUser = yield userModel_1.default.create(newUser);
            // generate user token
            const token = jsonwebtoken_1.default.sign({ userId: newUser.id, email: email }, jwtSecretKey, {
                expiresIn: '1h',
            });
            // create response's object
            const response = {
                user: {
                    name,
                    email,
                    id: newUser.id,
                },
                token,
            };
            return (0, responseModel_1.responseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.CREATED,
                content: response,
            });
        }
        catch (err) {
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                message: `userRegisterAsync|${err}`,
            });
        }
    });
}
function userSignInAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error, value } = userSignInValidatorSchema_1.userSignInValidatorSchema.validate(req.body);
            if (error) {
                return (0, validatorSchemaResponse_1.validatorSchemaResponse)({ req, res, error });
            }
            const { email, password } = req.body;
            const user = yield userModel_1.default.findOne({ email: email });
            if (!user) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    message: 'Invalid e-mail or password.',
                    status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                });
            }
            const samePassword = yield bcrypt_1.default.compare(password, user.password);
            if (!samePassword) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    message: 'Invalid e-mail or password.',
                    status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                });
            }
            // generate user token
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: email }, jwtSecretKey, {
                expiresIn: '1h',
            });
            const response = {
                user: {
                    email,
                    name: user.name,
                    lastName: user.lastName,
                    id: user.id,
                },
                token,
            };
            return (0, responseModel_1.responseModel)({
                req,
                res,
                content: response,
                status: StatusCodeEnum_1.statusCodeEnum.SUCCESS,
            });
        }
        catch (err) {
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                message: `userSignInAsync|${err}`,
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
            });
        }
    });
}
