import { Router } from "express";
import { commentGetByPostAction } from "../controller/commentGetByPostAction";
import { commentUnderPostAction } from "../controller/commentUnderPostAction";
import { postCreateAction } from "../controller/postCreateAction";
import { postDeleteAction } from "../controller/postDeleteAction";
import { postUpdateAction } from "../controller/postUpdateAction";
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

router.put("/", authenticateJWT, (request, response) => {
  postUpdateAction(request, response);
});

router.delete("/", authenticateJWT, (request, response) => {
  postDeleteAction(request, response);
});
