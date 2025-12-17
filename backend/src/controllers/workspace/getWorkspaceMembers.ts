

import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";


const getWorkspaceMembers = async (req:Request,res:Response,next:NextFunction) => {
    try {

        const id = req.params.id as string;

        const workspace = await prisma.workspace.findFirst({
      where: {
        id,
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

    if (!workspace) {
      throw new Error('Workspace not found or access denied');
    }

    const members = workspace.members || [];

    return sendResponse(res,200,true,"Memeber added to workspace",members)
    } catch (error) {
        next(error)
    }
}


export default getWorkspaceMembers;