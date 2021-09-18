import {Request, Response} from "express"
import { getManager } from "typeorm"
import { Post } from "../entity/Post"

export async function postUpdateAction(request: Request, response: Response) {

    // validate request
    if(!request.body.post_id) {
        response.status(400).json({
            message: 'Invalid request'
        })
    }
    
    // fetch repo
    const postRepo = getManager().getRepository(Post)

    // find post
    const post = await postRepo.findOne(request.body.post_id)
    if(!post) {
        response.status(404).send({
            message: "Post not found"
        })
        return 
    }

    // modify
    if(request.body.description) {
        post.description = request.body.description
    }
    if(request.body.imageurl) {
        post.imageurl = request.body.imageurl
    }
    if(request.body.title) {
        post.title = request.body.title
    }

    // update db
    response.status(200).send(await postRepo.save(post))
}