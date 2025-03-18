import express from "express";
import * as userController from "../controllers/userController.js";
import { CreateUserRequest } from "../models/user/CreateUserRequest.js";
import bcrypt from "bcrypt";
import { LoginRequest } from "../models/user/LoginRequest.js";

const router = express.Router();
const isProd = process.env.NODE_ENV === "production";

router.post("/register", async (req, res) => {
  let createUserRequest = req.body as CreateUserRequest;

  const errors = userController.validateCreateUserRequest(createUserRequest);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  // hash the password with 2^15 salting rounds
  createUserRequest.password = await bcrypt.hash(
    createUserRequest.password,
    15,
  );

  try {
    const newUser = await userController.createUser(createUserRequest);
    res.json({ message: "User registered successfully", newUser });
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  const loginRequest = req.body as LoginRequest;

  if (!loginRequest.email || !loginRequest.password) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const user = await userController.loginUser(
    loginRequest.email,
    loginRequest.password,
  );
  if (!user) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const token = userController.generateTokenForUser(user);
  // add the token to the cookies
  res.cookie("token", token, {
    httpOnly: true,
    // secure cookies on production environemtn
    secure: isProd,
    // allows cookies from different domains on production (frontend)
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 12, // expires in 12 hours
  });

  res.json({ message: "Logged in successfully" });
});

router.get("/userInfo", async (req, res) => {
  const token: string | null = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await userController.findUserByToken(token);

    if (!user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

router.post("/logout", (_, res) => {
  // remove token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: isProd ? "none" : "lax",
  });

  res.json({ message: "Logged out successfully" });
});

export default router;
