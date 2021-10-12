import { response, Router } from "express";
import { request } from "http";
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

router.get("/:post_id/comments", (request, response) => {
  commentGetByPostAction(request, response);
});

router.post("/", authenticateJWT, (request, response) => {
  postCreateAction(request, response);
});

router.post("/comment", authenticateJWT, (request, response) => {
  commentUnderPostAction(request, response);
});

router.post("/upvote", authenticateJWT, (request, response) => {
  postUpvoteAction(request, response);
});

router.post("/downvote", authenticateJWT, (request, response) => {
  postDownvoteAction(request, response);
});

router.post("/unvote", authenticateJWT, (request, response) => {
  postUnvoteAction(request, response);
});

router.put("/", authenticateJWT, (request, response) => {
  postUpdateAction(request, response);
});

router.delete("/", authenticateJWT, (request, response) => {
  postDeleteAction(request, response);
});
