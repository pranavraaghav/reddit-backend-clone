import {Request, Response} from "express"
import { getManager } from "typeorm"
import { Community } from "../entity/Community"
import { User } from "../entity/User"

export async function communityCreateAction(request: Request, response: Response) {
    
    // fetch repo
    const communityRepository = getManager().getRepository(Community)

    // validate request
    if(!request.body.name || !request.body.user_id) {
        response.status(400).json({
            message: 'Invalid request'
        })
    }

    // check if community already exists
    const existingCommunity = await communityRepository.findOne({ name: request.body.name })
    if(existingCommunity) {
        response.status(400).json({
            message: 'Community already exists'
        })
        return 
    }

    // validate user id 
    const user = await getManager().getRepository(User).findOne({user_id: request.body.user_id})
    if(!user) {
        response.status(400).json({
            message: 'Invalid user_id'
        })
        return 
    }
    
    // create new community
    const community = new Community()
    community.name = request.body.name
    community.created_by_user_id = user
    community.description = request.body.description || null

    response.status(200).send(await communityRepository.save(community))

}