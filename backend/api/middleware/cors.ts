import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export const corsOptions = cors({
  origin: process.env.frontendUrl,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
