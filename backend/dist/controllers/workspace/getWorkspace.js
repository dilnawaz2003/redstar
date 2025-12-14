import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";
const getWorkspaceById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const workspace = await prisma.workspace.findFirst({
            where: {
                id,
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                projects: {
                    include: {
                        tasks: {
                            select: {
                                id: true,
                                title: true,
                                status: true,
                                priority: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                _count: {
                    select: {
                        members: true,
                        projects: true,
                    },
                },
            },
        });
        if (!workspace) {
            throw new Error('Workspace not found or access denied');
        }
        return sendResponse(res, 200, true, "Memeber added to workspace", workspace);
    }
    catch (error) {
        next(error);
    }
};
export default getWorkspaceById;
//# sourceMappingURL=getWorkspace.js.map