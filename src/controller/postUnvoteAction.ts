import { Request, Response } from "express";
import Joi from "joi";
import { getConnection, getManager } from "typeorm";
import { Post } from "../entity/Post";
import { Vote, voteType } from "../entity/Vote";

export async function postUnvoteAction(request: Request, response: Response) {
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

  // check if vote already exists
  try {
    var vote = await getConnection()
      .getRepository(Vote)
      .createQueryBuilder("vote")
      .leftJoinAndSelect("vote.post", "post")
      .leftJoinAndSelect("vote.user", "user")
      .where("post.post_id = :post_id", { post_id: post_id })
      .andWhere("user.user_id = :user_id", { user_id: user_id })
      .getOne();

    if (!vote) {
      response.status(404).send({
        message: "No votes cast by user on post exist",
      });
      return;
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: "error fetching vote", error: error });
  }

  // fetch post to update vote count
  try {
    var post = await getConnection()
      .getRepository(Post)
      .findOne({ where: { post_id: post_id } });
    if (!post) {
      response.status(404).send({
        message: "Post not found",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ message: "Issue fetching post", error: error });
    return;
  }

  switch (vote.value) {
    case voteType.UPVOTE:
      post.upvote_count -= 1;
      break;

    case voteType.DOWNVOTE:
      post.downvote_count -= 1;
      break;

    default:
      break;
  }

  try {
    // two calls because cascade behaviour wouldn't work like I thought it would.
    await getConnection().getRepository(Post).save(post);
    await getConnection().getRepository(Vote).remove(vote);
    response.status(200).send({ message: "Unvoted successfully" });
  } catch (error) {
    response.status(500).json({ message: "error unvoting", error: error });
  }
}
