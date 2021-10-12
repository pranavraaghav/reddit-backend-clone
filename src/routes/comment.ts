import { Router } from "express";
import { commentDeleteAction } from "../controller/commentDeleteAction";
import { commentUnderCommentAction } from "../controller/commentUnderCommentAction";
import { commentUpdateAction } from "../controller/commentUpdateActions";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

router.post("/comment", authenticateJWT, (request, response) => {
  commentUnderCommentAction(request, response);
});

router.put("/", authenticateJWT, (request, response) => {
  commentUpdateAction(request, response);
});

router.delete("/", authenticateJWT, (request, response) => {
  commentDeleteAction(request, response);
});
