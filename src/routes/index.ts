import { Router } from "express";
import { router as postRouter } from "./post";
import { router as communityRouter } from "./community";
import { router as userRouter } from "./user";

export const router = Router();

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/community", communityRouter);
