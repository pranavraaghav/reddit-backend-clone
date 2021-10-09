import { Router } from "express";
import { commentDeleteAction } from "../controller/commentDeleteAction";
import { commentUnderCommentAction } from "../controller/commentUnderCommentAction";
import { commentUpdateAction } from "../controller/commentUpdateActions";

export const router = Router();

router.post("/comment", (request, response) => {
  commentUnderCommentAction(request, response);
});

router.put("/", (request, response) => {
  commentUpdateAction(request, response);
});

router.delete("/", (request, response) => {
  commentDeleteAction(request, response);
});
