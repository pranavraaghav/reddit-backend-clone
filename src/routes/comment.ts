import { response, Router } from "express";
import { request } from "http";
import { commentDeleteAction } from "../controller/commentDeleteAction";
import { commentDownvoteAction } from "../controller/commentDownvoteAction";
import { commentUnderCommentAction } from "../controller/commentUnderCommentAction";
import { commentUnvoteAction } from "../controller/commentUnvoteAction";
import { commentUpdateAction } from "../controller/commentUpdateActions";
import { commentUpvoteAction } from "../controller/commentUpvoteAction";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

router.put("/", authenticateJWT, commentUpdateAction);
router.delete("/", authenticateJWT, commentDeleteAction);

router.post("/upvote", authenticateJWT, commentUpvoteAction);
router.post("/downvote", authenticateJWT, commentDownvoteAction);
router.post("/unvote", authenticateJWT, commentUnvoteAction);

router.post("/comment", authenticateJWT, commentUnderCommentAction); // Commenting under a comment