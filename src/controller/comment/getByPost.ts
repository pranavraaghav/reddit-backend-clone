import { Request, Response } from "express";
import { Comment } from "../../entity/Comment";
import { getConnection } from "typeorm";
import Joi from "joi";

export async function commentGetByPost(
  request: Request,
  response: Response
) {
  // request validation
  const schema = Joi.object({
    post_id: Joi.string().required(),
  });
  const { value, error } = schema.validate(request.params);
  if (error != null) {
    response.status(400).json({
      error: error,
    });
    return;
  }
  const { post_id } = value;

  // Fetching the comment tree
  try {
    const commentRoots = await getConnection()
      .getRepository(Comment)
      .createQueryBuilder("comment")
      .innerJoin("comment.post", "post")
      .select("comment", "post")
      .where("post.post_id = :id", { id: post_id })
      .andWhere("comment.isRoot = :value", { value: true })
      .getMany();

    var comments = await Promise.all(
      commentRoots.map(async (comment): Promise<Comment> => {
        return await getConnection()
          .getTreeRepository(Comment)
          .findDescendantsTree(comment);
      })
    );
    if (!comments) {
      response.status(404).json({
        message: "Cannot find any comment trees for this post",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  response.status(200).json(comments);
}
