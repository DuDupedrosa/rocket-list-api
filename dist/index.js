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
// src/index.js
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const express_session_1 = __importDefault(require("express-session"));
require("reflect-metadata");
const swagger_1 = require("./swagger");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const mongooseConnection = process.env.PRIVATE_MONGOOSE_CONNECTION;
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
const allowlist = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rocket-list.vercel.app',
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mongooseConnection)
            return;
        yield mongoose_1.default.connect(mongooseConnection);
    });
}
const corsOptionsDelegate = (req, callback) => {
    const origin = req.header('Origin');
    let corsOptions;
    if (origin && allowlist.includes(origin)) {
        corsOptions = { origin: true }; // Reflete a origem solicitada na resposta CORS
    }
    else {
        corsOptions = { origin: false }; // Desativa CORS para esta solicitação
    }
    callback(null, corsOptions); // Callback espera dois parâmetros: erro e opções
};
main().catch((err) => console.log(err));
app.use((0, helmet_1.default)());
app.disable('x-powered-by');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: 'express secret key course',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, expires: expiryDate },
}));
app.use((0, cors_1.default)(corsOptionsDelegate));
app.use(routes_1.default);
(0, swagger_1.setupSwagger)(app);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
