import { Router } from "express";
import { userCreateAction } from "../controller/userCreateAction";
import { userDeleteAction } from "../controller/userDeleteAction";
import { userLoginAction } from "../controller/userLoginAction";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

router.post("/signup", userCreateAction);
router.post("/login", userLoginAction);
router.delete("/", authenticateJWT, userDeleteAction);