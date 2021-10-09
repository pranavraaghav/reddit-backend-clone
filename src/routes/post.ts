import { Router } from "express";
import { commentUnderPostAction } from "../controller/commentUnderPostAction";
import { postCreateAction } from "../controller/postCreateAction";
import { postDeleteAction } from "../controller/postDeleteAction";
import { postGetAllByCommunityAction } from "../controller/postGetAllByCommunityAction";
import { postUpdateAction } from "../controller/postUpdateAction";

export const router = Router();

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

router.get("/:community_id", (request, response) => {
  postGetAllByCommunityAction(request, response);
});
