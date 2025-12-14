import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";
const getUserWorkspaces = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                _count: {
                    select: {
                        members: true,
                        projects: true,
                    },
                },
                members: {
                    where: {
                        userId: userId,
                    },
                    select: {
                        user: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        console.log(workspaces[0]?.members);
        return sendResponse(res, 200, true, "Workspaces fecthed successfully", workspaces);
    }
    catch (error) {
        console.log("getUserWorkspaces Error :", error);
        next(error);
    }
};
export default getUserWorkspaces;
//# sourceMappingURL=getUserWorkspaces.js.map