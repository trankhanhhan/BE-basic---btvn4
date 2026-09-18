import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Thiếu Access Token. Vui lòng đăng nhập!'
    });
  }

  jwt.verify(token, ACCESS_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Access Token không hợp lệ hoặc đã hết hạn!'
      });
    }

    req.user = decodedUser; 
    next();
  });
};