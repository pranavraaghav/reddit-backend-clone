import { Request, Response } from "express";
import { Comment } from "../../entity/Comment";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";
import Joi from "joi";

export async function commentUnderComment(
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
    var user = await getConnection()
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
    var parentComment = await getConnection()
      .getRepository(Comment)
      .createQueryBuilder("comment")
      .innerJoin("comment.post", "post")
      .select(["comment.comment_id", "post.post_id", "post.comment_count"])
      .where("comment.comment_id = :id", { id: comment_id })
      .getOne();

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
  comment.post = parentComment.post;

  // Create Comment
  try {
    var createdComment = await getConnection()
      .getRepository(Comment)
      .save(comment);
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // Response
  const responseObject: any = createdComment;
  delete responseObject.parent;
  delete responseObject.post;
  response.status(201).send(createdComment);
}
