import type { NextFunction, Request, Response } from "express";
declare const getWorkspaceActivity: (req: Request, res: Response, next: NextFunction) => Promise<({
    task: {
        id: string;
        title: string;
        project: {
            id: string;
            name: string;
        };
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
} & {
    id: string;
    taskId: string;
    userId: string;
    action: string;
    details: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
})[] | undefined>;
export default getWorkspaceActivity;
//# sourceMappingURL=getWorkspaceActivity.d.ts.map