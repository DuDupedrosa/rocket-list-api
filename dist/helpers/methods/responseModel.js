"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseModel = responseModel;
exports.errorResponseModel = errorResponseModel;
function responseModel({ req, res, status, content }) {
    res.status(status).json({ content, statusCode: status });
}
function errorResponseModel({ req, res, status, message, }) {
    res.status(status).json({ message, statusCode: status });
}
