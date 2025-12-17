import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";
const getTasks = async (req, res, next) => {
    try {
        const { project, status, assignedTo, priority, search } = req.query;
        const userId = req.user.id;
        const where = {
            project: {
                workspace: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
        };
        if (project) {
            where.projectId = project;
        }
        if (status && status !== 'all') {
            where.status = status;
        }
        if (assignedTo && assignedTo !== 'all') {
            where.assignedTo = assignedTo;
        }
        if (priority && priority !== 'all') {
            where.priority = priority;
        }
        if (search && search.toString().trim() !== "") {
            where.title = {
                contains: search,
            };
        }
        const tasks = await prisma.task.findMany({
            where,
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                activityLogs: {
                    select: {
                        id: true,
                        action: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 5,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return sendResponse(res, 200, true, "Tasks fetched sucessfully", tasks);
    }
    catch (error) {
        next(error);
    }
};
export default getTasks;
//# sourceMappingURL=getTasks.js.map