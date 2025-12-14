import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/ApiError.js";
const getProjects = async (req, res, next) => {
    try {
        console.log("getProjects called");
        const workspaceId = req.query.workspace;
        const userId = req.user.id;
        // Verify user is a member of the workspace
        const member = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
            },
        });
        if (!member) {
            throw new ApiError(404, 'Access denied');
        }
        const projects = await prisma.project.findMany({
            where: {
                workspaceId,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                    },
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        dueDate: true,
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
        return sendResponse(res, 200, true, "projects fectehd successfully", projects);
    }
    catch (error) {
        console.log("getProjects Error :", error);
        next(error);
    }
};
export default getProjects;
//# sourceMappingURL=getProjects.js.map