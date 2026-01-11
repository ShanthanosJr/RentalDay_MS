// Middleware to check if user is authenticated
const authenticateToken = async (req, res, next) => {
  // For this application, we're using session/localStorage based auth
  // The frontend handles authentication state in localStorage
  // For this implementation, we'll validate that the request has proper headers
  // indicating the user is authenticated
  
  // In this MERN app, we'll check if the request includes user identification
  // Since the frontend manages auth state, we'll validate based on the user's role
  // when they make requests
  const userId = req.headers['user-id'];
  const userRole = req.headers['user-role'];
  
  if (!userId || !userRole) {
    return res.status(401).json({ message: 'Access denied. Authentication required.' });
  }
  
  // Add user info to request for use in route handlers
  req.user = { id: userId, role: userRole };
  next();
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  // Since the frontend handles auth state, we'll validate that the user has admin role
  // We'll check for user role in the request headers
  const userId = req.headers['user-id'];
  const userRole = req.headers['user-role'];
  
  if (!userId || !userRole) {
    return res.status(401).json({ message: 'Access denied. Authentication required.' });
  }
  
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  
  // Add user info to request for use in route handlers
  req.userId = userId;
  req.userRole = userRole;
  next();
};

module.exports = { authenticateToken, requireAdmin };