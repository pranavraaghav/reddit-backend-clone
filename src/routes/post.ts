import { Router } from "express";
import { commentGetByPostAction } from "../controller/commentGetByPostAction";
import { commentUnderPostAction } from "../controller/commentUnderPostAction";
import { postCreateAction } from "../controller/postCreateAction";
import { postDeleteAction } from "../controller/postDeleteAction";
import { postUpdateAction } from "../controller/postUpdateAction";

export const router = Router();

router.get("/:post_id/comments", (request, response) => {
  commentGetByPostAction(request, response);
});

router.post("/", (request, response) => {
  postCreateAction(request, response);
});

router.post("/comment", (request, response) => {
  commentUnderPostAction(request, response);
});

router.put("/", (request, response) => {
  postUpdateAction(request, response);
});

router.delete("/", (request, response) => {
  postDeleteAction(request, response);
});
