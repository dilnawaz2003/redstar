import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";


const createWorkspace = async  (req:Request,res:Response,next:NextFunction) =>{
    try {
      const {id } = req.user;
      const {name} = req.body;
    const workspace = await prisma.workspace.create({
      data: {
        name,
        createdById:id as string,
        members: {
          create: {
            userId: id,
            role: 'owner',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });


    return sendResponse(res,200,true,"Workspace created",workspace)
    
    } catch (error) {
        next(error)
    }
}


export default createWorkspace;