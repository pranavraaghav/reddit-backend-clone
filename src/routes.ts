import { Request, Response } from "express"
import { postGetAllByCommunityAction } from "./controller/postGetAllByCommunityAction"
import { communityCreateAction } from "./controller/communityCreateAction"
import { postCreateAction } from "./controller/postCreateAction"
import { postUpdateAction } from "./controller/postUpdateAction"
import { postDeleteAction } from "./controller/postDeleteAction"

interface IRoute {
    path: string
    method: 'get' | 'post' | 'put' | 'delete'
    action:  (request: Request, response: Response) => Promise<void>;
  }  

export const AppRoutes: IRoute[] = [
    // community
    {
        path: '/community',
        method: 'post',
        action: communityCreateAction,
    },

    // post
    {
        path: '/post',
        method: 'post',
        action: postCreateAction
    },
    
    {
        path: '/post',
        method: 'put',
        action: postUpdateAction
    },

    {
        path: '/post',
        method: 'delete',
        action: postDeleteAction
    },

    {
        path: '/post/:community_id',
        method: 'get',
        action: postGetAllByCommunityAction
    }
]