import type { Response } from "express";

const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null
): Response => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default sendResponse;
