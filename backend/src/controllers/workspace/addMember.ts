import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";

const addMemberToWorkspace = async (req:Request,res:Response,next:NextFunction) => {
 
    try {
        const {workspaceId,userId,role} = req.body;
        const addedBy = req.user.id
         // Verify the adder is a member of the workspace
        const adderMember = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId,
            userId: addedBy,
            role: {
            in: ['owner', 'admin'],
            },
        },
        });

    if (!adderMember) {
      throw new Error('Only owners and admins can add members');
    }

    // Check if user is already a member
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    if (existingMember) {
      throw new Error('User is already a member of this workspace');
    }

    // Add member
    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return sendResponse(res,200,true,"Member added to workspace",member);

    } catch (error) {
        next(error)
    }
}


export default addMemberToWorkspace;