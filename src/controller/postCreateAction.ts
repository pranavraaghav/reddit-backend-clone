import { Request, Response } from "express";
import Joi from "joi";
import { getManager } from "typeorm";
import { Community } from "../entity/Community";
import { Post } from "../entity/Post";
import { User } from "../entity/User";

export async function postCreateAction(request: Request, response: Response) {
  // fetch repo
  const postRepo = getManager().getRepository(Post);

  // request validation
  const schema = Joi.object({
    title: Joi.string().required(),
    community_id: Joi.string().uuid().required(),
    user_id: Joi.string().uuid().required(),
    imageurl: Joi.string(),
    description: Joi.string(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { title, community_id, user_id, imageurl, description } = value;

  // validate user id
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

  // validate community id
  try {
    var community = await getManager()
      .getRepository(Community)
      .findOne({ community_id: community_id });
    if (!community) {
      response.status(400).json({
        message: "Invalid community_id",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // create new post
  const post = new Post();
  post.title = title;
  post.imageurl = imageurl || null;
  post.description = description || null;
  post.created_by = user;
  post.community = community;

  try {
    response.status(200).send(await postRepo.save(post));
  } catch (error) {
    response.status(500).json({ error: error });
  }
}
