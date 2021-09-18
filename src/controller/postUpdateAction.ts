import { Request, Response } from "express";
import Joi from "joi";
import { getManager } from "typeorm";
import { Post } from "../entity/Post";

export async function postUpdateAction(request: Request, response: Response) {
  // request validation
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    post_id: Joi.string().uuid().required(),
    title: Joi.string(),
    description: Joi.string(),
    imageurl: Joi.string(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { user_id, post_id, title, description, imageurl } = value;

  const postRepo = getManager().getRepository(Post);

  // find post
  try {
    var post = await postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.created_by", "created_by")
      .where("created_by.user_id = :user_id", { user_id: user_id })
      .getOne();
    if (!post) {
      response.status(404).send({
        message: "Post not found",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // validate if owner user is changing
  if (post.created_by.user_id != user_id) {
    response.status(400).json({
      message: "Only post owner can update post",
    });
    return;
  }

  // modify
  post.description = description || post.description;
  post.imageurl = imageurl || post.imageurl;
  post.title = title || post.title;

  // update db
  try {
    response.status(200).send(await postRepo.save(post));
  } catch (error) {
    response.status(500).json({ error: error });
  }
}
