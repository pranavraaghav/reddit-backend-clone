import { Request, Response } from "express";
import Joi from "joi";
import { getManager } from "typeorm";
import { User } from "../../entity/User";
import * as jwt from "jsonwebtoken";

export async function userCreate(request: Request, response: Response) {
  // ensuring jwt secret is defined
  try {
    var secret: string = process.env.JWT_SECRET!;
    var expiresIn: string = process.env.JWT_EXPIRES_IN! || "30d";
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  // fetch repo
  const userRepo = getManager().getRepository(User);

  // request validation
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { username, password } = value;

  // validate username unique-ness
  try {
    var existingUser = await userRepo.findOne({ username: username });
    if (existingUser) {
      response.status(409).json({
        message: "userame already taken",
      });
      return;
    }
  } catch (e) {
    response.status(500).json({ error: error });
    return;
  }

  // create new user
  const user = new User();
  user.username = username;
  user.password = password;

  try {
    var createdUser = await userRepo.save(user);
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  const token = jwt.sign({ id: createdUser.user_id }, secret, {
    expiresIn: expiresIn,
  });

  response.status(201).send({
    message: "User created successfully",
    token_type: "Bearer",
    jwt: token,
  });
}
