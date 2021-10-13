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

router.post("/comment", authenticateJWT, (request, response) => {
  commentUnderCommentAction(request, response);
});

router.post("/upvote", authenticateJWT, (request, response) => {
  commentUpvoteAction(request, response);
});

router.post("/downvote", authenticateJWT, (request, response) => {
  commentDownvoteAction(request, response);
});

router.post("/unvote", authenticateJWT, (request, response) => {
  commentUnvoteAction(request, response);
});

router.put("/", authenticateJWT, (request, response) => {
  commentUpdateAction(request, response);
});

router.delete("/", authenticateJWT, (request, response) => {
  commentDeleteAction(request, response);
});
