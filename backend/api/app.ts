import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { corsOptions } from "./middleware/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routers/authRouter.js";
import postRouter from "./routers/postRouter.js";
import groupRouter from "./routers/groupRouter.js";
import commentRouter from "./routers/commentRouter.js";

// load config
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to allow API to recieve JSON requests
app.use(express.json());
// Middleware to allow requests from different domains (frontend when deployed)
app.use(corsOptions);
// Allows cookies to be used in requests
app.use(cookieParser());
// Erro handler for unhandled errors
app.use(errorHandler);

// Add individual routers using a base route
app.use("/", authRouter);
app.use("/post", postRouter);
app.use("/post", commentRouter);
app.use("/group", groupRouter);

// make the api avaliable on the provided port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
