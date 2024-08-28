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
exports.getUserController = getUserController;
exports.updateUserController = updateUserController;
exports.deleteUserController = deleteUserController;
exports.userChangePasswordController = userChangePasswordController;
const userService_1 = require("../../services/user/userService");
function getUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, userService_1.getUserAsync)(req, res);
    });
}
function updateUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, userService_1.updateUserAsync)(req, res);
    });
}
function deleteUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, userService_1.deleteUserAsync)(req, res);
    });
}
function userChangePasswordController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, userService_1.userChangePasswordAsync)(req, res);
    });
}
