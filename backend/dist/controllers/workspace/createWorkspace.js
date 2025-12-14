import { prisma } from "../../config/prisma.js";
import sendResponse from "../../utils/sendResponse.js";
const createWorkspace = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { name } = req.body;
        const workspace = await prisma.workspace.create({
            data: {
                name,
                createdById: id,
                members: {
                    create: {
                        userId: id,
                        role: 'owner',
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
            },
        });
        return sendResponse(res, 200, true, "Workspace created", workspace);
    }
    catch (error) {
        next(error);
    }
};
export default createWorkspace;
//# sourceMappingURL=createWorkspace.js.map