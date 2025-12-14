import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";


const createProject = async (req:Request,res:Response,next:NextFunction) => {

    const {workspaceId,name,description} = req.body;
    const createdBy = req.user.id;
       // Verify user is a member of the workspace
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: createdBy,
      },
    });

    if (!member) {
      throw new Error('You must be a member of the workspace to create projects');
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspaceId,
      },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });

    return sendResponse(res,201,true,"Project created successfully",project)
}

 

export default createProject;