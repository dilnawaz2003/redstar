import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";


const deleteTask =  async (req:Request,res:Response,next:NextFunction) => {
    try {

    const {id} = req.body;
    const userId = req.user.id;
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          workspace: {
            members: {
              some: {
                userId,
                role: {
                  in: ['owner', 'admin'],
                },
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    await prisma.$transaction(async (tx:any) => {
      // Delete activity logs first
      await tx.activityLog.deleteMany({
        where: { taskId: id },
      });

      // Delete task
      await tx.task.delete({
        where: { id },
      });

      // Create deletion log in workspace activity
      await tx.activityLog.create({
        data: {
          taskId: id,
          userId,
          action: 'deleted',
          details: {
            title: task.title,
            projectId: task.projectId,
          },
        },
      });
    });

    sendResponse(res,200,true,"Task Deleted Successfully",task)
  }
    catch (error) {
        next(error)
    }
}


export default deleteTask;


