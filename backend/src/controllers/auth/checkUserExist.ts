import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import jwt from 'jsonwebtoken'
import sendResponse from "../../utils/sendResponse.js";



const checkUserExist = async (req:Request,res:Response,next:NextFunction) => {
try {
        
        const token = req.query.token as string;
        const payload = jwt.verify(token,process.env.JWT_SECRET as string) as any;

        const user =await  prisma.user.findFirst({where:{email:payload.email}})

        if (user) {
        const {email, workspaceId, invitedById,} = payload;
        const [workspace,inviter] = await Promise.all([prisma.workspace.findUnique({where:{id:workspaceId}}),prisma.user.findUnique({where:{id:invitedById}})]);

            return sendResponse(res,200,true,"user found",{found:true,data:{
                email:email,
                workspaceName:workspace?.name,
                invitedBy:inviter?.name,
            }})
        }

        return sendResponse(res,200,true,"user found",{found:false})
    } catch (error) {
        console.log("checkuserexist error :",error)
        next(error)
    }
} 


export default checkUserExist;