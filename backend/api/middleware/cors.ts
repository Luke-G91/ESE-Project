import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export const corsOptions = cors({
  origin: process.env.frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
