import { Request, Response } from "express";
import Joi from "joi";
import { getManager } from "typeorm";
import { Post } from "../../entity/Post";

export async function postDelete(request: Request, response: Response) {
  // request validation
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    post_id: Joi.string().uuid().required(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { user_id, post_id } = value;

  const postRepo = getManager().getRepository(Post);

  // find post
  try {
    var post = await postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.created_by", "created_by")
      .where("post.post_id = :post_id", {
        post_id: post_id,
      })
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

  // validate user
  if (post.created_by.user_id != user_id) {
    response.status(400).json({
      message: "Only creator of a post can delete it",
    });
    return;
  }

  // update db
  try {
    response.status(200).send(await postRepo.remove(post));
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }
}
