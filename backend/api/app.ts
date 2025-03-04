import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

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

interface UserViewModel {
  name: string;
  email: string;
}

app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    const userViewModels: UserViewModel[] = users.map((user): UserViewModel => {
      return {
        name: user.name,
        email: user.email,
      };
    });

    res.json(userViewModels);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users." });
  }
});

app.post("/api/register", async (req, res) => {
  const { email, name, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.json({ message: "Logged in successfully" });
});

app.get("/api/userInfo", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const userViewModel: UserViewModel = {
      name: user.name,
      email: user.email,
    };

    res.json(userViewModel);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ message: "Logged out successfully" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
