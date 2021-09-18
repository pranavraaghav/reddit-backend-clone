import {Request, Response} from "express"
import { getManager } from "typeorm"
import { Community } from "../entity/Community"
import { Post } from "../entity/Post"
import { User } from "../entity/User"

export async function postCreateAction(request: Request, response: Response) {
    
    // fetch repo
    const postRepo = getManager().getRepository(Post)

    // validate request
    if(!request.body.community_id || !request.body.user_id || !request.body.title) {
        response.status(400).json({
            message: 'Invalid request'
        })
    }

    // validate user id 
    const user = await getManager().getRepository(User).findOne({user_id: request.body.user_id})
    if(!user) {
        response.status(400).json({
            message: 'Invalid user_id'
        })
        return 
    }

    // validate community id 
    const community = await getManager().getRepository(Community).findOne({community_id: request.body.community_id})
    if(!community) {
        response.status(400).json({
            message: 'Invalid community_id'
        })
        return 
    }

    // create new post
    const post = new Post()
    post.title = request.body.title
    post.imageurl = request.body.imageurl || null
    post.description = request.body.description || null
    post.created_by = user
    post.community = community

    response.status(200).send(await postRepo.save(post))

}