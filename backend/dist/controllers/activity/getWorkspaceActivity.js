import { prisma } from "../../config/prisma.js";
const getWorkspaceActivity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        // Verify user is a member
        const member = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: id,
                userId,
            },
        });
        if (!member) {
            throw new Error('Access denied');
        }
        const logs = await prisma.activityLog.findMany({
            where: {
                task: {
                    project: {
                        workspaceId: id,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                        project: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });
        return logs;
    }
    catch (error) {
        next(error);
    }
};
export default getWorkspaceActivity;
//# sourceMappingURL=getWorkspaceActivity.js.map