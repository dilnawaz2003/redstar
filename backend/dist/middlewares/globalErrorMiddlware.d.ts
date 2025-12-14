import type { NextFunction, Request, Response } from "express";
declare function globalErrorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export default globalErrorHandlerMiddleware;
//# sourceMappingURL=globalErrorMiddlware.d.ts.map