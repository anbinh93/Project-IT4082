const jwt = require("jsonwebtoken");

const getTokenFromHeader = (req) => {
    const token = req.header("Authorization")
    return token ? token.replace("Bearer ", "") : null
};

const verifyToken = (req, res, next) => {
    const token = getTokenFromHeader(req)
    
    console.log('🔍 Token verification debug:');
    console.log('- Request path:', req.path);
    console.log('- Authorization header:', req.header("Authorization"));
    console.log('- Extracted token:', token ? token.substring(0, 20) + '...' : 'NULL');
    console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    if (!token) {
        console.log('❌ No token provided');
        return res.status(403).json({ message: "Truy cập bị từ chối! Không có token." })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('✅ Token valid, user:', decoded.username, 'role:', decoded.role);
        req.user = decoded
        next()
    } catch (err) {
        console.log('❌ Token verification failed:', err.message);
        console.log('- Token length:', token.length);
        console.log('- Error type:', err.name);
        res.status(401).json({ message: "Token không hợp lệ!", error: err.message })
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
