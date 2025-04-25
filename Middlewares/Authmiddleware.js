import jwt from "jsonwebtoken";

const secretkey = "SECRETKEY";

export const Protect = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
    ? req.headers.authorization.split(' ')[1] 
    : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Authorization required.' });
  }

  try {
    const decoded = jwt.verify(token, secretkey);
    
    
    req.userId = decoded.userId;
    next(); 
  } catch (error) {
    console.error('JWT verification failed:', error); 
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
