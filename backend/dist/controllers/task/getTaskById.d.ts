import type { NextFunction, Request } from "express";
declare const getTaskById: (req: Request, res: Response, next: NextFunction) => Promise<{
    id: string;
    createdAt: Date;
    projectId: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    assignedTo: string | null;
} | undefined>;
export default getTaskById;
//# sourceMappingURL=getTaskById.d.ts.map