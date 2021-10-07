import { Router } from "express";
import { router as postRouter } from "./post";
import { router as communityRouter } from "./community";

export const router = Router();

router.use("/post", postRouter);
router.use("/community", communityRouter);
