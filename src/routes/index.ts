import { Router } from "express";
import { router as postRouter } from "./post";
import { router as commentRouter } from "./comment";
import { router as communityRouter } from "./community";
import { router as userRouter } from "./user";
import { baseAction } from "../controller/baseAction";

export const router = Router();

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);
router.use("/community", communityRouter);

router.get("/", baseAction);
