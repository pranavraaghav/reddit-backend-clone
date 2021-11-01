import { Router } from "express";
import { commentGetByPostAction } from "../controller/commentGetByPostAction";
import { commentUnderPostAction } from "../controller/commentUnderPostAction";
import { postCreateAction } from "../controller/postCreateAction";
import { postDeleteAction } from "../controller/postDeleteAction";
import { postDownvoteAction } from "../controller/postDownvoteAction";
import { postUnvoteAction } from "../controller/postUnvoteAction";
import { postUpdateAction } from "../controller/postUpdateAction";
import { postUpvoteAction } from "../controller/postUpvoteAction";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

// Unauthorized 
router.get("/:post_id/comments", commentGetByPostAction);

// Authorized
router.post("/", authenticateJWT, postCreateAction);
router.put("/", authenticateJWT, postUpdateAction);
router.delete("/", authenticateJWT, postDeleteAction);

router.post("/upvote", authenticateJWT, postUpvoteAction);
router.post("/downvote", authenticateJWT, postDownvoteAction);
router.post("/unvote", authenticateJWT, postUnvoteAction);

router.post("/comment", authenticateJWT, commentUnderPostAction);
