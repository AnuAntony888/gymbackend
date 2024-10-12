const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Authorization header should include 'Bearer <token>'
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Check if the token starts with 'Bearer ' and extract the actual token
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    // Verify token using the JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is invalid or expired' });
        }
        req.user = user; // Pass the user information to the next handler
        next();
    });
};

module.exports = authenticateToken;
