import type { NextFunction, Request, Response } from "express"
import sendResponse from "../../utils/sendResponse.js";


const getCurrentUser = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {password,...rest} = req.user;
        sendResponse(res,200,true,"User Fecthed Successfully",rest)

    } catch (error) {
        next(error)
    }
}


export default getCurrentUser;