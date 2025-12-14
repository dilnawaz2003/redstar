import type { NextFunction, Request, Response } from "express";
declare const getTasks: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default getTasks;
//# sourceMappingURL=getTasks.d.ts.map