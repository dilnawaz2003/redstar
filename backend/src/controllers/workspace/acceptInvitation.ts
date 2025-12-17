import type { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { prisma } from "../../config/prisma.js";
import { hashPassword } from "../../utils/bcrypt.js";
import sendResponse from "../../utils/sendResponse.js";

const acceptInvitation = async (req:Request,res:Response,next:NextFunction) => {
   
try {
    const { token, name, password} = req.body;
    const userId = req.user.id

  if (!token) {
    throw new ApiError(404,'Token is required')
  }


  const payload = jwt.verify(token,process.env.JWT_SECRET as string);
  if (!payload) throw new ApiError(404,"Payload not found")

  const { email, workspaceId, invitedById, role } = payload as any;

  const invitation = await prisma.workspaceInvitation.findFirst({
    where: {
      token,
      email,
      workspaceId,
      status: 'pending',
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },
      invitedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!invitation) throw new ApiError(404, 'Invitation not found or has expired')

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const hashedPassword = await hashPassword(password);
    user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                password:true
            },
            });
  }

   const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId:user.id,
      },
    });


    
    if (existingMember) throw new ApiError(400,"Already a membber")

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId:user.id,
        role,
      },
    });

    await prisma.workspaceInvitation.update({
      where: { id: invitation.id },
      data: {
        status: 'accepted',
        acceptedAt: new Date(),
      },
    });


    return sendResponse(res,200,true,"invitation accepted",{success:true,workspaceId})
} catch (error) {
  console.log("accept invite error :",error)
    next(error)
}
    
}


export default acceptInvitation;