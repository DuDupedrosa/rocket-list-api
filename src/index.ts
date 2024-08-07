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
const allowlist: string[] = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://rocket-list.vercel.app',
];

async function main() {
  if (!mongooseConnection) return;
  await mongoose.connect(mongooseConnection);
}

const corsOptionsDelegate: CorsOptionsDelegate<Request> = (
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void
) => {
  const origin = req.header('Origin');
  let corsOptions: CorsOptions;

  if (origin && allowlist.includes(origin)) {
    corsOptions = { origin: true }; // Reflete a origem solicitada na resposta CORS
  } else {
    corsOptions = { origin: false }; // Desativa CORS para esta solicitação
  }

  callback(null, corsOptions); // Callback espera dois parâmetros: erro e opções
};

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
app.use(cors(corsOptionsDelegate));
app.use(router);
setupSwagger(app);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
