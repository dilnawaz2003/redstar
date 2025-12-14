import type { NextFunction, Request } from "express"
import { prisma } from "../../config/prisma.js";


const getTaskById = async (req:Request,res:Response,next:NextFunction) => {
    try {

        const {id} = req.query;
        const userId = req.user.id;
    const task = await prisma.task.findFirst({
      where: {
        id,
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
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        activityLogs: {
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
        },
      },
    });

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    return task;
  }
     catch (error) {
        next(error)
    }
} 


export default getTaskById;


