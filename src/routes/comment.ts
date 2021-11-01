import { Router } from "express";
import { commentDelete } from "../controller/comment/delete";
import { commentDownvote } from "../controller/comment/downvote";
import { commentUnderComment } from "../controller/comment/commentUnderComment";
import { commentUnvote } from "../controller/comment/unvote";
import { commentUpdate } from "../controller/comment/update";
import { commentUpvote } from "../controller/comment/upvote";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

router.put("/", authenticateJWT, commentUpdate);
router.delete("/", authenticateJWT, commentDelete);

router.post("/upvote", authenticateJWT, commentUpvote);
router.post("/downvote", authenticateJWT, commentDownvote);
router.post("/unvote", authenticateJWT, commentUnvote);

router.post("/comment", authenticateJWT, commentUnderComment); // Commenting under a comment