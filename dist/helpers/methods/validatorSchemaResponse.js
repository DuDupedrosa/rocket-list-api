"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorSchemaResponse = validatorSchemaResponse;
const StatusCodeEnum_1 = require("../enums/StatusCodeEnum");
function validatorSchemaResponse({ req, res, error }) {
    res.status(StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST).json({
        message: 'Validation failed',
        statusCode: StatusCodeEnum_1.statusCodeEnum.BAD_REQUEST,
        erros: error.details.map((detail) => detail.message),
    });
}
