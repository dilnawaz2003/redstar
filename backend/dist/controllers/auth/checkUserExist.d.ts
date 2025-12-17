import type { NextFunction, Request, Response } from "express";
declare const checkUserExist: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default checkUserExist;
//# sourceMappingURL=checkUserExist.d.ts.map