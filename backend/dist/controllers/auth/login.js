import { prisma } from "../../config/prisma.js";
import ApiError from "../../utils/ApiError.js";
import { comparePasswords, hashPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/jwt.js";
import sendResponse from "../../utils/sendResponse.js";
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });
        const finalPayload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
        sendResponse(res, 201, true, "user created successfully", finalPayload);
    }
    catch (error) {
        next(error);
    }
};
export default login;
//# sourceMappingURL=login.js.map