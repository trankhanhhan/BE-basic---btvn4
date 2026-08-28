export const requireAuth = (req, res, next) => {
    const tokenHeaders = req.headers["token-auth"];

    // Nếu không truyền hoặc truyền sai token -> Chặn 
    if (!tokenHeaders || tokenHeaders !== "secrets123") {
        return res.status(401).json({
            sucess: false,
            message: "Truy cập bị từ chối: Token không hợp lệ hoặc bị thiếu"
        });
    }

    // Nếu hợp lệ -> Pass
    console.log("Token hợp lệ, cho phép đi tiếp.");
    next();    
}
export const requireAdminRole = (req, res, next) => {
    const role = req.headers['x-role'];

    if (role !== 'admin') {
        const error = new Error('Truy cập bị từ chối: Yêu cầu quyền admin!');
        error.statusCode = 403;
        return next(error);
    }

    next();
};