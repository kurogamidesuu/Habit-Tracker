import express, { Application, Request, Response,  } from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitRouter from "./routes/habit.route";
import userRouter from "./routes/user.route";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/habits', habitRouter);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy and running!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
