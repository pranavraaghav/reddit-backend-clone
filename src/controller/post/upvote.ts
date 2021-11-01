import { Request, Response } from "express";
import Joi from "joi";
import { getConnection, getManager } from "typeorm";
import { Post } from "../../entity/Post";
import { User } from "../../entity/User";
import { Vote, voteType } from "../../entity/Vote";

export async function postUpvote(request: Request, response: Response) {
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
    var existingVote = await getConnection()
      .getRepository(Vote)
      .createQueryBuilder("vote")
      .leftJoinAndSelect("vote.post", "post")
      .leftJoinAndSelect("vote.user", "user")
      .where("post.post_id = :post_id", { post_id: post_id })
      .andWhere("user.user_id = :user_id", { user_id: user_id })
      .getOne();

    if (existingVote) {
      if (existingVote.value === voteType.UPVOTE) {
        response.status(400).json({
          message: "Cannot upvote more than once",
        });
      }
      if (existingVote.value === voteType.DOWNVOTE) {
        existingVote.value = voteType.UPVOTE;
        existingVote.post.upvote_count += 1;
        existingVote.post.downvote_count -= 1;
        try {
          await getConnection().getRepository(Vote).save(existingVote);
          response.status(200).json({ message: "Vote updated to a upvote" });
        } catch (error) {
          response
            .status(400)
            .json({ message: "Error updating existing vote ", error: error });
          return;
        }
      }
      return;
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Internal server error", error: error });
  }

  // fetch user
  try {
    var user = await getConnection()
      .getRepository(User)
      .findOne({ where: { user_id: user_id } });
    if (!user) {
      response.status(404).send({
        message: "User not found",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // find post
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

  // modify
  const vote = new Vote();
  vote.value = voteType.UPVOTE;
  vote.post = post;
  vote.user = user;
  post.upvote_count += 1;

  // update db
  try {
    response
      .status(200)
      .send(await getConnection().getRepository(Vote).save(vote));
  } catch (error) {
    response.status(500).json({ error: error });
  }
}
