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
exports.getUserAsync = getUserAsync;
exports.updateUserAsync = updateUserAsync;
exports.deleteUserAsync = deleteUserAsync;
const userModel_1 = __importDefault(require("../../models/user/userModel"));
const StatusCodeEnum_1 = require("../../helpers/enums/StatusCodeEnum");
const responseModel_1 = require("../../helpers/methods/responseModel");
const updateUserValidatorSchema_1 = require("../../validatorSchemas/user/updateUserValidatorSchema");
const validatorSchemaResponse_1 = require("../../helpers/methods/validatorSchemaResponse");
function getUserAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            if (!userId) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST,
                    message: 'Required user id params',
                });
            }
            const userData = yield userModel_1.default.findOne({ id: userId });
            if (userData) {
                const { name, lastName, email, id } = userData;
                const response = {
                    name,
                    lastName,
                    email,
                    id,
                };
                return (0, responseModel_1.responseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.SUCCESS,
                    content: response,
                });
            }
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                message: 'User id not found',
            });
        }
        catch (err) {
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                message: `userProfileService|${err}`,
            });
        }
    });
}
function updateUserAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = updateUserValidatorSchema_1.updateUserValidatorSchema.validate(req.body);
            if (error) {
                return (0, validatorSchemaResponse_1.validatorSchemaResponse)({ req, res, error });
            }
            const { id, name, email, lastName } = req.body;
            const user = yield userModel_1.default.findOne({ id: id });
            if (!user) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    message: 'Not found user',
                    status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                });
            }
            const userUpdated = yield userModel_1.default.findOneAndUpdate({ id: id }, {
                name: name,
                email: email,
                lastName: lastName !== undefined ? lastName : null,
            }, {
                new: true,
                runValidators: true,
            });
            if (!userUpdated) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    message: `Internal server error|updateUserAsync`,
                    status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                });
            }
            const response = {
                name: userUpdated.name,
                email: userUpdated.email,
                lastName: userUpdated.lastName,
                id: userUpdated.id,
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
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                message: `updateUserAsync|${err}`,
            });
        }
    });
}
function deleteUserAsync(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            if (!userId) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST,
                    message: 'Required user id params',
                });
            }
            const userDeleted = yield userModel_1.default.findOneAndDelete({ id: userId });
            if (!userDeleted) {
                return (0, responseModel_1.errorResponseModel)({
                    req,
                    res,
                    status: StatusCodeEnum_1.statusCodeEnum.NOT_FOUND,
                    message: 'Not found user',
                });
            }
            return (0, responseModel_1.responseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.SUCCESS,
                content: 'User deleted with success',
            });
        }
        catch (err) {
            return (0, responseModel_1.errorResponseModel)({
                req,
                res,
                status: StatusCodeEnum_1.statusCodeEnum.INTERNAL_SERVER_ERRO,
                message: 'deleteUserAsync|${err}',
            });
        }
    });
}
