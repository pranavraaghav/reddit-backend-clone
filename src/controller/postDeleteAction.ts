import {Request, Response} from "express"
import { getManager } from "typeorm"
import { Post } from "../entity/Post"

export async function postDeleteAction(request: Request, response: Response) {

    // validate request
    if(!request.body.post_id || !request.body.user_id) {
        response.status(400).json({
            message: 'Invalid request'
        })
    }
    
    // fetch repo
    const postRepo = getManager().getRepository(Post)

    // find post
    const post = await postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.created_by', 'created_by')
        .getOne()
    if(!post) {
        response.status(404).send({
            message: "Post not found"
        })
        return 
    }

    // validate if correct user wants to delete
    // TODO: get user id from request after authentication
    if(post.created_by.user_id != request.body.user_id) {
        response.status(400).send({
            message: "Only creator of a post can delete it"
        })
        return 
    }
 
    // update db
    response.status(200).send(await postRepo.remove(post))
}