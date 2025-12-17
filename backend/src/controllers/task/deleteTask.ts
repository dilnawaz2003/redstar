import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";


const deleteTask =  async (req:Request,res:Response,next:NextFunction) => {
    try {

      console.log("deleteTask Called");

    const id = req.params.id as string;
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
      throw new ApiError(404,'Task not found or access denied');
    }

    const deletedTask =  await prisma.task.delete({
        where: { id },
      });

    if (!deletedTask) {
      throw new ApiError(500,'Task not found or access denied');
    }



    sendResponse(res,200,true,"Task Deleted Successfully",task)
  }
    catch (error) {
      console.log("delete Task error : ",error)
        next(error)
    }
}


export default deleteTask;


