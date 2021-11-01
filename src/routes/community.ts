import { Router } from "express";
import { communityCreateAction } from "../controller/communityCreateAction";
import { postGetAllByCommunityAction } from "../controller/postGetAllByCommunityAction";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

// Unauthorized
router.get("/:community_id/posts", postGetAllByCommunityAction);

// Authorized
router.post("/", authenticateJWT, communityCreateAction);