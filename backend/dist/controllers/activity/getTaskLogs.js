import { prisma } from '../../config/prisma.js';
import sendResponse from '../../utils/sendResponse.js';
const getTasksLogs = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const task = await prisma.task.findFirst({
            where: {
                id: id,
                project: {
                    workspace: {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
            },
        });
        if (!task) {
            throw new Error('Task not found or access denied');
        }
        const logs = await prisma.activityLog.findMany({
            where: {
                taskId: id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        sendResponse(res, 200, true, "Logs fectched successfully", logs);
    }
    catch (error) {
        next(error);
    }
};
export default getTasksLogs;
//# sourceMappingURL=getTaskLogs.js.map