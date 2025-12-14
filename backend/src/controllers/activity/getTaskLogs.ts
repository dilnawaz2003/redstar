import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import sendResponse from '../../utils/sendResponse.js';


const getTasksLogs = async (req:Request,res:Response,next:NextFunction) => {
    try {
    const { id } = req.params;
      const userId = (req as any).user.id;
    const task = await prisma.task.findFirst({
      where: {
        id: id as string,
        project: {
          workspace: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    const logs = await prisma.activityLog.findMany({
      where: {
        taskId:id as string,
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
      orderBy: {
        createdAt: 'desc',
      },
    });


    sendResponse(res,200,true,"Logs fectched successfully",logs)
  }
    catch (error) {
        next(error)
    }
}


export default getTasksLogs;




