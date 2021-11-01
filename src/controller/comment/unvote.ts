import { Request, Response } from "express";
import Joi from "joi";
import { getConnection } from "typeorm";
import { Comment } from "../../entity/Comment";
import { Vote, voteType } from "../../entity/Vote";

export async function commentUnvote(
  request: Request,
  response: Response
) {
  // request validation
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    comment_id: Joi.string().uuid().required(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { user_id, comment_id } = value;

  // check if vote already exists
  try {
    var vote = await getConnection()
      .getRepository(Vote)
      .createQueryBuilder("vote")
      .leftJoinAndSelect("vote.comment", "comment")
      .leftJoinAndSelect("vote.user", "user")
      .where("comment.comment_id = :comment_id", { comment_id: comment_id })
      .andWhere("user.user_id = :user_id", { user_id: user_id })
      .getOne();

    if (!vote) {
      response.status(404).send({
        message: "No votes cast by user on comment exist",
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
    var comment = await getConnection()
      .getRepository(Comment)
      .findOne({ where: { comment_id: comment_id } });
    if (!comment) {
      response.status(404).send({
        message: "Comment not found",
      });
      return;
    }
  } catch (error) {
    response
      .status(500)
      .json({ message: "Issue fetching comment", error: error });
    return;
  }

  switch (vote.value) {
    case voteType.UPVOTE:
      comment.upvote_count -= 1;
      break;

    case voteType.DOWNVOTE:
      comment.downvote_count -= 1;
      break;

    default:
      break;
  }

  try {
    // two calls because cascade behaviour wouldn't work like I thought it would.
    await getConnection().getRepository(Comment).save(comment);
    await getConnection().getRepository(Vote).remove(vote);
    response.status(200).send({ message: "Unvoted successfully" });
  } catch (error) {
    response.status(500).json({ message: "error unvoting", error: error });
  }
}
