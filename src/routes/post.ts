import { Router } from "express";
import { commentGetByPost } from "../controller/comment/getByPost";
import { commentUnderPost } from "../controller/comment/commentUnderPost";
import { postCreate } from "../controller/post/create";
import { postDelete } from "../controller/post/delete";
import { postDownvote } from "../controller/post/downvote";
import { postUnvote } from "../controller/post/unvote";
import { postUpdate } from "../controller/post/update";
import { postUpvote } from "../controller/post/upvote";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

// Unauthorized 
router.get("/:post_id/comments", commentGetByPost);

// Authorized
router.post("/", authenticateJWT, postCreate);
router.put("/", authenticateJWT, postUpdate);
router.delete("/", authenticateJWT, postDelete);

router.post("/upvote", authenticateJWT, postUpvote);
router.post("/downvote", authenticateJWT, postDownvote);
router.post("/unvote", authenticateJWT, postUnvote);

router.post("/comment", authenticateJWT, commentUnderPost);
