import sendResponse from "../../utils/sendResponse.js";
const getCurrentUser = async (req, res, next) => {
    try {
        const { password, ...rest } = req.user;
        sendResponse(res, 200, true, "User Fecthed Successfully", rest);
    }
    catch (error) {
        next(error);
    }
};
export default getCurrentUser;
//# sourceMappingURL=getCurrentUser.js.map