import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";


const createTask = async (req:Request,res:Response,next:NextFunction) => {

    try {
        const {title , description , status , priority  ,dueDate , assignedTo , projectId} = req.body;
        const createdBy  = req.user.id;

    // Verify user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: {
              userId: createdBy,
            },
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    const task = await prisma.$transaction(async (tx:any) => {
      // Create task
      const task = await tx.task.create({
        data: {
          title: title,
          description: description,
          status: status,
          priority: priority,
          dueDate: dueDate,
          assignedTo: assignedTo,
          projectId: projectId,
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              workspaceId: true,
            },
          },
        },
      });

      // Create activity log
      await tx.activityLog.create({
        data: {
          taskId: task.id,
          userId: createdBy,
          action: 'created',
          details: {
            title: task.title,
            status: task.status,
            priority: task.priority,
          },
        },
      });

      return task;
    });

    sendResponse(res,201,true,"Task Created",task)
  } catch (error) {
    next(error)
    }
}


export default createTask;




