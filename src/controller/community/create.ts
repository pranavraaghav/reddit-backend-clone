import { Request, Response } from "express";
import Joi from "joi";
import { getManager } from "typeorm";
import { Community } from "../../entity/Community";
import { User } from "../../entity/User";

export async function communityCreate(
  request: Request,
  response: Response
) {
  // request validation
  const schema = Joi.object({
    name: Joi.string().required(),
    user_id: Joi.string().uuid().required(),
    description: Joi.string(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { name, user_id, description } = value;

  const communityRepository = getManager().getRepository(Community);

  // check if user is valid
  try {
    var user = await getManager()
      .getRepository(User)
      .findOne({ user_id: user_id });
    if (!user) {
      response.status(400).json({
        message: "Invalid user_id",
      });
      return;
    }
  } catch (e) {
    response.status(500).json({ error: error });
    return;
  }

  // checking if community already exists
  try {
    var existingCommunity = await communityRepository.findOne({ name: name });
    if (existingCommunity) {
      response.status(400).json({
        message: "Community already exists",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // create new community
  const community = new Community();
  community.name = name;
  community.created_by = user;
  community.description = description || null;

  try {
    response.status(200).send(await communityRepository.save(community));
  } catch (error) {
    response.status(500).json({ error: error });
  }
}
