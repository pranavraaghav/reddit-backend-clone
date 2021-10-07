import { Router } from "express";
import { communityCreateAction } from "../controller/communityCreateAction";

export const router = Router();

router.post("/", (request, response) => {
  communityCreateAction(request, response);
});
