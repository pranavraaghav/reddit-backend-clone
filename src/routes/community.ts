import { Router } from "express";
import { communityCreate } from "../controller/community/create";
import { postGetAllByCommunity } from "../controller/post/getAllByCommunity";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

// Unauthorized
router.get("/:community_id/posts", postGetAllByCommunity);

// Authorized
router.post("/", authenticateJWT, communityCreate);