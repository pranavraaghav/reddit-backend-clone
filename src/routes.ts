import { Request, Response } from "express"
import { postGetAllAction } from "./controller/postGetAllAction"

interface IRoute {
    path: string
    method: 'get' | 'post' | 'put' | 'delete'
    action:  (request: Request, response: Response) => Promise<void>;
  }  

export const AppRoutes: IRoute[] = [
    {
        path: '/posts',
        method: 'get',
        action: postGetAllAction,
    },
]