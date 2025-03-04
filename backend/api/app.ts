import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter";

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

app.use("/api", authRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
