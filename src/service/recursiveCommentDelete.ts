import { getConnection } from "typeorm";
import { Comment } from "../entity/Comment";

export default async function recursiveDescendantCommentDelete(
  comment: Comment
) {
  try {
    var commentArray = await getConnection()
      .getTreeRepository(Comment)
      .createDescendantsQueryBuilder("comment", "comment_closure", comment)
      .leftJoinAndSelect("comment.post", "post")
      .getMany();
    if (commentArray === undefined) {
      throw new Error("commentArray returned Undefined");
    }
  } catch (error) {
    console.log(error);
    return;
  }

  const post = commentArray[0].post;

  await Promise.all(
    commentArray.map(async (comment) => {
      getConnection().getRepository(Comment).remove(comment);
    })
  ).then(() => {
    post.decrementCommentCountBy(commentArray.length);
  });

  return;
}
