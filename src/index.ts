// src/index.js
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes';
import mongoose from 'mongoose';
import helmet from 'helmet';
import session from 'express-session';
import 'reflect-metadata';
import { setupSwagger } from './swagger';
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const mongooseConnection = process.env.PRIVATE_MONGOOSE_CONNECTION;
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

// Lê as URLs permitidas do arquivo .env
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Função para verificar se a origem está na lista de permitidas
// const corsOptions: CorsOptions | CorsOptionsDelegate<Request> = {
//   origin: (origin, callback) => {
//     if (origin && allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else if (!origin) {
//       // Permite solicitações sem origem (como cURL ou Postman)
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

async function main() {
  if (!mongooseConnection) return;
  await mongoose.connect(mongooseConnection);
}

main().catch((err) => console.log(err));
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'express secret key course',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, expires: expiryDate },
  })
);
app.use(router);
app.use(
  cors({
    origin: 'http://localhost:5173', // Substitua pelo endereço do seu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
setupSwagger(app);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
