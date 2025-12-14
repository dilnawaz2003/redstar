import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";


const updateTask = async (req:Request,res:Response,next:NextFunction ) => {
    try {
        const id  = req.params.id as string;
        const data = req.body;
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
    });

    if (!task) {
      throw new Error('Task not found or access denied');
    }

    const updatedTask = await prisma.$transaction(async (tx:any) => {
      // Get old values for activity log
      const oldValues = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
      };

      // Update task
      const updatedTask = await tx.task.update({
        where: { id },
        data,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Determine what changed
      const changes: any = {};
      Object.keys(oldValues).forEach((key) => {
        if (oldValues[key as keyof typeof oldValues] !== updatedTask[key as keyof typeof updatedTask]) {
          changes[key] = {
            from: oldValues[key as keyof typeof oldValues],
            to: updatedTask[key as keyof typeof updatedTask],
          };
        }
      });

      // Create activity log for changes
      if (Object.keys(changes).length > 0) {
        await tx.activityLog.create({
          data: {
            taskId: id,
            userId,
            action: 'updated',
            details: { changes },
          },
        });
      }

      return updatedTask;
    });

    sendResponse(res,200,true,"Task Updated Successfully",updatedTask)
  } catch (error) {

    console.log("updated Task Error : ",error)
        next(error)
    }
}

export default updateTask;


