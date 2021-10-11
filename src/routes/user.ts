import { Router } from "express";
import { userCreateAction } from "../controller/userCreateAction";
import { userDeleteAction } from "../controller/userDeleteAction";
import { userLoginAction } from "../controller/userLoginAction";
import { authenticateJWT } from "../middleware/auth";

export const router = Router();

router.post("/signup", (request, response) => {
  userCreateAction(request, response);
});

router.post("/login", (request, response) => {
  userLoginAction(request, response);
});

router.delete("/", authenticateJWT, (request, response) => {
  userDeleteAction(request, response);
});
