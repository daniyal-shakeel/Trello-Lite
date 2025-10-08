import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { redirectToGoogle, handleGoogleCallback } from "./controllers/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.js";
import { boardRouter } from "./routes/board.js";
import { userAuth } from "./middlewares/userAuth.js";
import { taskRouter } from "./routes/task.js";
import { commentRouter } from "./routes/comment.js";

const app = express();
export const port = process.env.PORT || 3000;

connectDB();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URI],
    credentials: true,
  })
);

app.get("/", (_, res) => {
  res.send("API WORKING");
});

app.get("/check-auth", userAuth, (req, res) => {
  return res.json({
    success: true,
    message: "Authentication successful",
    user: req.payload,
  });
});

app.get("/google", redirectToGoogle);
app.get("/google/callback", handleGoogleCallback);

app.use("/api/user", userRouter);
app.use("/api/board", userAuth, boardRouter);
app.use("/api/task", userAuth, taskRouter);
app.use("/api/comment", userAuth, commentRouter);

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
