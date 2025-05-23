import cors from "cors";
import dotenv from "dotenv";

// load config
dotenv.config();

export const corsOptions = cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  // allows cookies in requests
  credentials: true,
});
