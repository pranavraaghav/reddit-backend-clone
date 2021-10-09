import { Request, Response } from "express";
import { Comment } from "../entity/Comment";
import { getManager } from "typeorm";
import { User } from "../entity/User";
import Joi from "joi";

export async function commentUnderCommentAction(
  request: Request,
  response: Response
) {
  // request validation
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    comment_id: Joi.string().required(),
    text: Joi.string().required(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { comment_id, user_id, text } = value;

  // Fetching user
  try {
    var user = await getManager()
      .getRepository(User)
      .findOne({
        select: ["user_id", "username"],
        where: { user_id: user_id },
      });
    if (!user) {
      response.status(404).json({
        message: "User does not exist",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // Fetching parent comment
  try {
    var parentComment = await getManager()
      .getRepository(Comment)
      .findOne({
        select: ["comment_id"],
        where: { comment_id: comment_id },
      });
    if (!parentComment) {
      response.status(404).json({
        message: "parentComment does not exist, check comment_id",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  const comment = new Comment();
  comment.parent = parentComment;
  comment.created_by = user;
  comment.text = text;

  try {
    const commentRepo = getManager().getRepository(Comment);
    response.status(201).send(await commentRepo.save(comment));
  } catch (error) {
    response.status(500).json({ error: error });
  }
}
