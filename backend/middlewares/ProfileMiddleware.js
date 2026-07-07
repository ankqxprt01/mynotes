// Import jsonwebtoken CommonJS package using ES module default import
import jwt from "jsonwebtoken";

// Extract verify function from jwt object
const { verify } = jwt;

const ProfileMiddleware = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = verify(token, process.env.jwt_secret);
      // console.log("Decoded Token:", decodedToken);
      req.user = decodedToken.userId;//use req.user
      next();
    } catch (error) {
      res.status(401).send({ success: false, message: "Unauthorized" });
    }
  };

  export default ProfileMiddleware;