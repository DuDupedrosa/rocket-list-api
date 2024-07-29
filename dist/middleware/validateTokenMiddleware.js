"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const StatusCodeEnum_1 = require("../helpers/enums/StatusCodeEnum");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecretKey = process.env.JWT_TOKEN_SECRET_KEY
    ? process.env.JWT_TOKEN_SECRET_KEY
    : '';
function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodeEnum_1.statusCodeEnum.UNAUTHORIZED).json({
            message: 'Access denied. No token provided.',
            statusCode: StatusCodeEnum_1.statusCodeEnum.UNAUTHORIZED,
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
        req.user = decoded; // Adicione informações do usuário à requisição
        next();
    }
    catch (err) {
        return res.status(StatusCodeEnum_1.statusCodeEnum.UNAUTHORIZED).json({
            message: 'Invalid token.',
            statusCode: StatusCodeEnum_1.statusCodeEnum.UNAUTHORIZED,
        });
    }
}
