import { Router } from "express";
import { communityCreateAction } from "../controller/communityCreateAction";
import { postGetAllByCommunityAction } from "../controller/postGetAllByCommunityAction";

export const router = Router();

router.post("/", (request, response) => {
  communityCreateAction(request, response);
});

router.get("/:community_id/posts", (request, response) => {
  postGetAllByCommunityAction(request, response);
});
