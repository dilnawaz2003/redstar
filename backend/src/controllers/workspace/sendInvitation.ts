import type { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/ApiError.js";
import sendResponse from "../../utils/sendResponse.js";
import { sendInvitationEmail } from "../../utils/sendInvitationEmail.js";
import { prisma } from "../../config/prisma.js";
import jwt from 'jsonwebtoken';

const sendInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, workspaceId , role="member" } = req.body;
    const userId = req.user.id;
    const inviterName = req.user.name;
    const inviterEmail = req.user.email;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const workspace =await prisma.workspace.findUnique({where:{id:workspaceId}})

    if (!workspace) throw new ApiError(404,"Workspace not found");


     const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: userId,
        role: { in: ['owner', 'admin'] },
      },
    });


    if(!workspaceMember) throw new ApiError(403,"Access Denied")


      const existingUser = await prisma.user.findUnique({
        where: { email },
        });


    if (existingUser) {
      const existingMember = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId: existingUser.id,
        },
        
      });

      if (existingMember) throw new ApiError(400,"User is already a member of this workspace")

    }


    const existingInvitation = await prisma.workspaceInvitation.findFirst({
      where: {
        workspaceId,
        email,
        status: 'pending',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) throw new ApiError(400,"Invite Alreasy sent");

    const token = jwt.sign({
      email,
      workspaceId,
      invitedById: userId,
      role,
    }, process.env.JWT_SECRET as string, { expiresIn:'7d' });;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    const invitation = await prisma.workspaceInvitation.create({
      data: {
        workspaceId,
        email,
        token,
        role,
        invitedById: userId,
        expiresAt,
        status: 'pending',
      },
    });


    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitations/accept?token=${token}`;

    await sendInvitationEmail({
      to: email,
      inviterName,
      workspaceName:workspace.name,
      inviteLink,
    });

    return sendResponse(res, 200, true, "Invitation email sent successfully",{success:true});
  } catch (error) {
    console.log("Send invitation errir : ",error)
    next(error);
  }
};

export default sendInvitation;
