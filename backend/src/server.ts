import express, { Application, Request, Response,  } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import habitRouter from "./routes/habit.route";
import userRouter from "./routes/user.route";
import pushRouter from "./routes/push.route";
import './lib/scheduler';
import authRouter from "./routes/auth.route";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(cors({
  origin: [ process.env.FRONTEND_URL!, process.env.BACKEND_BASE_URL!, 'http://localhost:5173' ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: true,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
}));

app.use('/user', userRouter);
app.use('/habits', habitRouter);
app.use('/push', pushRouter);
app.use('/auth', authRouter);

app.use((err: any, req: Request, res: Response, next: Function) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`[Error] ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? "Internal Server Error" : err.message,
    ...( !isProduction && { stack: err.stack } )
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy and running!",
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;