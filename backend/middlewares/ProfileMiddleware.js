import jwt from "jsonwebtoken";

const { verify } = jwt;

const ProfileMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        message: "Auth Failed",
        success: false,
      });
    }

    const decoded = verify(token, process.env.jwt_secret);

    // console.log("DECODED TOKEN:", decoded);

    req.userId = decoded.userId;

    if (!req.userId) {
      return res.status(401).send({
        message: "User id missing in token",
        success: false,
      });
    }

    next();
  } catch (error) {
    // console.log("AUTH ERROR:", error.message);

    return res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};

export default ProfileMiddleware;
