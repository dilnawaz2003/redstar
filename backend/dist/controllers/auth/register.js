import { prisma } from "../../config/prisma.js";
import ApiError from "../../utils/ApiError.js";
import { hashPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.js";
import sendResponse from "../../utils/sendResponse.js";
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
            throw new ApiError(400, "User with this email already exist");
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });
        sendResponse(res, 201, true, "user created successfully", { email: user.email, token: token });
    }
    catch (error) {
        console.log("Register Error : ", error);
        next(error);
    }
};
export default register;
//# sourceMappingURL=register.js.map