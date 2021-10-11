import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";

export async function userLoginAction(request: Request, response: Response) {
  // ensuring jwt secret is defined
  try {
    var secret: string = process.env.JWT_SECRET!;
    var expiresIn: string = process.env.JWT_EXPIRES_IN! || "30d";
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  // request validation
  const { value, error } = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { username, password } = value;

  try {
    var user = await getManager()
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username: username })
      .getOne();
    if (!user) {
      response.status(404).send({
        message: "user does not exist",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // validate
  if ((await user.validatePassword(password)) === false) {
    response.status(400).send({
      message: "Incorrect password",
    });
    return;
  }

  const token = jwt.sign({ id: user.user_id }, secret, {
    expiresIn: expiresIn,
  });

  response.status(201).send({
    message: "Logged in successfully",
    token_type: "Bearer",
    jwt: token,
  });
}
