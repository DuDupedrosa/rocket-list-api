"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const productSchema = new Schema({
    name: { type: String, require: true },
    price: { type: Number, require: true },
});
const productModel = mongoose_1.default.model('products', productSchema);
exports.default = productModel;
