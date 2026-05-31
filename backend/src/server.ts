import express, { Application, Request, Response,  } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import habitRouter from "./routes/habit.route";
import userRouter from "./routes/user.route";
import pushRouter from "./routes/push.route";
import './lib/scheduler';
import authRouter from "./routes/auth.route";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(cookieParser());
app.use(cors({
  origin: [ process.env.FRONTEND_URL!, process.env.BACKEND_BASE_URL! ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/habits', habitRouter);
app.use('/push', pushRouter);
app.use('/auth', authRouter);

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