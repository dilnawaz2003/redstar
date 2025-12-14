import { prisma } from "../config/prisma.js";
export async function requireWorkspaceMember(req, res, next) {
    try {
        const workspaceId = req.params.id || req.query.workspace || req.body.workspaceId;
        const userId = req.user?.id;
        if (!workspaceId || !userId) {
            return res.status(400).json({ error: 'Workspace ID and user ID required' });
        }
        const member = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
            },
        });
        if (!member) {
            return res.status(403).json({
                error: 'Access denied. You must be a member of this workspace.'
            });
        }
        req.workspaceMember = member;
        next();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=requireWorkspaceMember.js.map