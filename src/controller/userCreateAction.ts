import { Request, Response } from "express";
import Joi from "joi";
import { getManager } from "typeorm";
import { User } from "../entity/User";

export async function userCreateAction(request: Request, response: Response) {
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
    const createdUser = await userRepo.save(user);
    // type User does not allow you to delete password
    // would violate type definition otherwise
    const responseObject: any = createdUser;
    delete responseObject.password;
    response.status(200).send(responseObject);
  } catch (error) {
    response.status(500).json({ error: error });
  }
}
