import { Router } from "express";
import { userCreateAction } from "../controller/userCreateAction";
import { userDeleteAction } from "../controller/userDeleteAction";

export const router = Router();

router.post("/", (request, response) => {
  userCreateAction(request, response);
});

router.delete("/", (request, response) => {
  userDeleteAction(request, response);
});
