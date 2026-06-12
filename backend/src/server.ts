import express, { Application, NextFunction, Request, Response,  } from "express";
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
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_BASE_URL,
  'http://localhost:5173',
].filter((origin): origin is string => !!origin);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});

const app: Application = express();

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(helmet());

// rate limiters
app.use(globalLimiter);
app.use('/user/login', authLimiter);
app.use('/user/signup', authLimiter);
app.use('/auth', authLimiter);

// routers
app.use('/api/user', userRouter);
app.use('/api/habits', habitRouter);
app.use('/api/push', pushRouter);
app.use('/api/auth', authRouter);

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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