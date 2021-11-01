import { Request, Response } from "express";
import { Comment } from "../../entity/Comment";
import { getManager } from "typeorm";
import Joi from "joi";
import recursiveDescendantCommentDelete from "../../service/recursiveCommentDelete";

export async function commentDelete(
  request: Request,
  response: Response
) {
  // request validation
  const schema = Joi.object({
    comment_id: Joi.string().uuid().required(),
    user_id: Joi.string().uuid().required(),
  });
  const { value, error } = schema.validate(request.body);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { comment_id, user_id } = value;

  const commentRepo = getManager().getRepository(Comment);

  // Fetching  comment
  try {
    var comment = await commentRepo
      .createQueryBuilder("comment")
      .leftJoin("comment.created_by", "created_by")
      .addSelect(["created_by.user_id"])
      .where("comment.comment_id = :comment_id", { comment_id: comment_id })
      .getOne();
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error fetching comment", error: error });
    return;
  }

  if (!comment) {
    response.status(404).json({
      message: "comment does not exist",
    });
    return;
  }

  if (comment.created_by.user_id != user_id) {
    response.status(403).json({
      message: "Unauthorized access to resource",
    });
    return;
  }

  // Delete the comment
  try {
    await recursiveDescendantCommentDelete(comment);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error deleting comment", error: error });
    return;
  }

  response.status(200).send({ message: "Deleted comments recursively" });
}
