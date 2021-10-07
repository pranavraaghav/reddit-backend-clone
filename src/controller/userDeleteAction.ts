import { Request, Response } from "express";
import Joi from "joi";
import { getManager } from "typeorm";
import { User } from "../entity/User";

export async function userDeleteAction(request: Request, response: Response) {
  // fetch repo
  const userRepo = getManager().getRepository(User);

  // request validation
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    password: Joi.string().required(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { user_id, password } = value;

  // find user
  try {
    var user = await userRepo.findOne({ user_id: user_id });
    if (!user) {
      response.status(404).json({
        message: "user does not exist",
      });
      return;
    }
  } catch (e) {
    response.status(500).json({ error: error });
    return;
  }

  // authenticate\
  if ((await user.validatePassword(password)) === false) {
    response.status(403).json({
      message: "Authentication failed, wrong password",
    });
    return;
  }
  try {
    const deletedUser = await userRepo.remove(user);
    response.status(200).send(deletedUser);
  } catch (error) {
    response.status(500).json({ error: error });
  }
}
