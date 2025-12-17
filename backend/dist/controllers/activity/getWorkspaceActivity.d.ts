import type { NextFunction, Request, Response } from "express";
declare const getWorkspaceActivity: (req: Request, res: Response, next: NextFunction) => Promise<({
    user: {
        name: string;
        email: string;
        id: string;
    };
    task: {
        id: string;
        title: string;
        project: {
            name: string;
            id: string;
        };
    };
} & {
    id: string;
    createdAt: Date;
    userId: string;
    taskId: string;
    action: string;
    details: import("@prisma/client/runtime/client").JsonValue | null;
})[] | undefined>;
export default getWorkspaceActivity;
//# sourceMappingURL=getWorkspaceActivity.d.ts.map