import {Request, Response} from "express"
import { getManager } from "typeorm"
import { Post } from "../entity/Post"

export async function postGetAllAction(request: Request, response: Response) {
    
    const postRepository = getManager().getRepository(Post)

    const posts = await postRepository.find()

    response.send(posts)
}