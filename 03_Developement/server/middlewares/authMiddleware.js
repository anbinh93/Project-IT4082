const jwt = require("jsonwebtoken");

const getTokenFromHeader = (req) => {
    const token = req.header("Authorization")
    return token ? token.replace("Bearer ", "") : null
};

const verifyToken = (req, res, next) => {
    const token = getTokenFromHeader(req)
    if (!token) {
        return res.status(403).json({ message: "Truy cập bị từ chối! Không có token." })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(401).json({ message: "Token không hợp lệ!" })
    }
};

const redirectIfAuthenticated = (req, res, next) => {
    const token = getTokenFromHeader(req)

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            return res.status(403).json({ message: "Bạn đã đăng nhập. Vui lòng đăng xuất để tiếp tục.", redirectToLogin: true })
        } catch (err) {
            console.log(err, token)
            return res.status(401).json({ message: "Token không hợp lệ." })
        }
    } else {
        return next()
    }
};

const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập!" })
        }
        next()
    };
};

module.exports = { verifyToken, verifyRole, redirectIfAuthenticated }
