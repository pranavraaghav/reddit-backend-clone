import { Request, Response } from "express";
import Joi from "joi";
import { getConnection, getManager } from "typeorm";
import { Comment } from "../../entity/Comment";
import { User } from "../../entity/User";
import { Vote, voteType } from "../../entity/Vote";

export async function commentUpvote(
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
    var existingVote = await getConnection()
      .getRepository(Vote)
      .createQueryBuilder("vote")
      .leftJoinAndSelect("vote.comment", "comment")
      .leftJoinAndSelect("vote.user", "user")
      .where("comment.comment_id = :comment_id", { comment_id: comment_id })
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
        // find comment
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
        comment.upvote_count += 1;
        comment.downvote_count -= 1;
        try {
          await getConnection().getRepository(Vote).save(existingVote);
          await getConnection().getRepository(Comment).save(comment);
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

  // find comment
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
      .json({ message: "Issue fetching commenet", error: error });
    return;
  }

  // modify
  const vote = new Vote();
  vote.value = voteType.UPVOTE;
  vote.comment = comment;
  vote.user = user;

  // update db
  try {
    // cascade behaviour of vote-comment insert didn't work properly
    // doesn't give error code so can't troubleshoot
    // using double queries for now
    await getConnection().getRepository(Vote).save(vote);
    comment.upvote_count += 1;
    await getConnection().getRepository(Comment).save(comment);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error saving new vote", error: error });
  }

  response.status(200).send({ message: "Upvoted comment successfully" });
}
