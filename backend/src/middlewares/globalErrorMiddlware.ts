import type { NextFunction,Request,Response } from "express";

function globalErrorHandlerMiddleware(err:any, req:Request, res:Response, next:NextFunction) {
    
    return res.status(err?.httpCode ?? 500).json({
        name: err.name,
        status: err?.httpCode ?? 500,
        success: false,
        error: true,
        message: err?.message,
        // description: err?.description,
    });
}


export default globalErrorHandlerMiddleware;