import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";
const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.query;
        const userId = req.user.id;
        const project = await prisma.project.findFirst({
            where: {
                id: id,
                workspace: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
            include: {
                workspace: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                tasks: {
                    include: {
                        assignee: {
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
                },
            },
        });
        if (!project) {
            throw new Error('Project not found or access denied');
        }
        sendResponse(res, 200, true, "Project Fecthed successfully", project);
    }
    catch (error) {
        next(error);
    }
};
export default getProjectById;
//# sourceMappingURL=getProjectById.js.map