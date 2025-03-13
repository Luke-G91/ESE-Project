import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter.js";
import postRouter from "./routers/postRouter.js";
import groupRouter from "./routers/groupRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL;

app.use(express.json());
app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/", authRouter);
app.use("/post", postRouter);
app.use("/group", groupRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
