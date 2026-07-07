// Import jsonwebtoken CommonJS package using ES module default import
import jwt from "jsonwebtoken";

// Extract verify function from jwt object
const { verify } = jwt;


// Export middleware function
export default (req, res, next) => {
  try {

    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    // Authorization format: Bearer token
    // Split and get only token part
    const token = authHeader.split(" ")[1];

    // Validate token
    if (!token) {
      return res.status(401).send({
        message: "Auth Failed",
        success: false,
      });
    }

    // Verify JWT token
    const decoded = verify(token, process.env.jwt_secret);

    // Store user id for routes
    req.userId = decoded.userId;

    // Continue to next middleware
    next();

  } catch (error) {

    // Invalid/expired token
    return res.status(401).send({
      message: "Auth Failed",
      success: false,
    });

  }
};