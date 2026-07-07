// Import jsonwebtoken CommonJS package
import jwt from "jsonwebtoken";

// Extract verify method from jwt object
const { verify } = jwt;


// Create authentication middleware
const authenticateToken = (req, res, next) => {
  try {

    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }


    // Authorization format:
    // Bearer <token>
    // Split and get only the token part
    const token = authHeader.split(" ")[1];


    // Check token exists
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }


    // Verify token using JWT secret
    const decodedToken = verify(
      token,
      process.env.jwt_secret
    );


    // Store user id for routes/controllers
    req.userId = decodedToken.userId;


    // Continue execution
    next();


  } catch (error) {

    // Token expired or invalid
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });

  }
};


// Export middleware
export default authenticateToken;