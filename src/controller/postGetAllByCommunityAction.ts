import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Post } from "../entity/Post";

export async function postGetAllByCommunityAction(
  request: Request,
  response: Response
) {
  const postRepository = getManager().getRepository(Post);

  try {
    var posts = await postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.community", "community")
      .leftJoinAndSelect("post.created_by", "created_by")
      .where("community.community_id = :community_id", {
        community_id: request.params.community_id,
      })
      .getMany();
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  response.status(200).send(posts);
}
