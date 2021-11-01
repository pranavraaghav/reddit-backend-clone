import { Router } from "express";
import { userCreate } from "../controller/user/create";
import { userDelete } from "../controller/user/delete";
import { userLogin } from "../controller/user/login";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

router.post("/signup", userCreate);
router.post("/login", userLogin);
router.delete("/", authenticateJWT, userDelete);