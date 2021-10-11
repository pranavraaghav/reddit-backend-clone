import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";

dotenv.config();

// Auth uses Json Web Tokens (JWT)

/**
 * authenticateJWT is used to add a key-value pair
 * into the Request.body
 */
export const authenticateJWT = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const tokenHeader = request.header("Authorization"); // Bearer Token
  if (!tokenHeader) {
    response.status(400).send({
      message: "Access denied, secure routes require jwt authorization",
    });
    return;
  }

  try {
    const token = tokenHeader.split(" ")[1];
    const secret: string = process.env.JWT_SECRET!;
    try {
      var payload: string | jwt.JwtPayload = jwt.verify(token, secret);
      /**
       * if payload is string, payload.id is invalid
       * so we need to assure TypeScript that it is not a string
       */
      if (typeof payload == "string") {
        throw new Error("Payload from jwt is string");
      }
    } catch (error) {
      response.status(500).json(error);
      return;
    }

    request.body.user_id = payload.id;
    next();
  } catch (error) {
    response.status(500).send({
      message: "Token is invalid",
    });
  }
};
