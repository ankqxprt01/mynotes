// Import Router from Express
import { Router } from "express";

// Create router instance
const router = Router();

// Import User mongoose model
import User from "../models/userModel.js";

// Import bcryptjs (CommonJS package)
import bcrypt from "bcryptjs";

// Extract hash and compare methods
const { hash, compare } = bcrypt;

// Import jsonwebtoken (CommonJS package)
import jwt from "jsonwebtoken";

// Extract sign method
const { sign } = jwt;

// Import authentication middleware
import authMiddleware from "../middlewares/authMiddleware.js";

// Import profile image middleware
import ProfileMiddleware from "../middlewares/ProfileMiddleware.js";

// Import multer
import multer from "multer";

// Create multer upload instance
const upload = multer();

// register new user //register api
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const existingUser = await findOne({ email: req.body.email });
    if (existingUser) {
      const userName = existingUser.name;
      return res.send({
        message: `${userName} already exists`,
        success: false,
        data: null,
      });
    }

    // Hash password
    const hashedPassword = await hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // Create new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      // profileImage: req.file.buffer, // Store image buffer
    });

    if (req.file) {
      newUser.profileImage.data = req.file.buffer;
      newUser.profileImage.contentType = req.file.mimetype;
    }

    await newUser.save();
    res.send({
      message: "User Created Successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// upload new image
router.post("/profileImage", ProfileMiddleware, async (req, res) => {
  // to use userId use authMiddleware with (req.body.userId)
  try {
    const user = await findById(req.user);
    if (!user || !user.profileImage) {
      return res.status(404).send("Profile image not found");
    }
    res.set("Content-Type", user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// update image
router.post(
  "/update-profile-image",
  ProfileMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      // Authenticated user should be available in req.user from ProfileMiddleware
      const userId = req.user;

      // Find the authenticated user in the database using their _id
      const existingUser = await findOne({ _id: userId });

      if (!existingUser) {
        return res.status(404).send({
          message: "User not found",
          success: false,
          data: null,
        });
      }

      // Update profile image if a new image is uploaded
      if (req.file) {
        existingUser.profileImage.data = req.file.buffer;
        existingUser.profileImage.contentType = req.file.mimetype;
        await existingUser.save();
      }

      // Fetch updated user data
      const updatedUser = await findOne({ _id: userId });

      res.send({
        message: "Profile image updated successfully",
        success: true,
        data: {
          user: updatedUser,
          image: req.file, // Assuming you want to return the image data as well
        },
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  }
);

// update name
router.post("/updateName", authMiddleware, async (req, res) => {
  try {
    // Find the user by email
    const existingUser = await findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if the user ID from the token matches the user ID in the request body
    if (req.body.userId !== existingUser._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized User",
        success: false,
      });
    }

    // Update the user's name
    existingUser.name = req.body.newName;

    // Save the updated user
    await existingUser.save();

    res.json({
      message: "User name updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

// delete image
router.post("/delete-profile-image", ProfileMiddleware, async (req, res) => {
  try {
    // Authenticated user should be available in req.user from ProfileMiddleware
    const userId = req.user;

    // Find the authenticated user in the database using their _id
    const existingUser = await findOne({ _id: userId });

    if (!existingUser) {
      return res.status(404).send({
        message: "User not found",
        success: false,
        data: null,
      });
    }

    // Check if the user already has a profile image
    if (!existingUser.profileImage.data) {
      return res.status(400).send({
        message: "User does not have a profile image to delete",
        success: false,
        data: null,
      });
    }

    // Delete the profile image data and content type
    existingUser.profileImage.data = undefined;
    existingUser.profileImage.contentType = undefined;
    await existingUser.save();

    // Fetch updated user data
    const updatedUser = await findOne({ _id: userId });

    res.send({
      message: "Profile image deleted successfully",
      success: true,
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// login api
// in login we have to compare with hashed pass
router.post("/login", async (req, res) => {
  try {
    const userExists = await findOne({ email: req.body.email });

    if (!userExists) {
      return res.send({
        message: "User does not exists",
        success: false,
        data: null,
      });
    }

    const passwordMatch = await compare(
      req.body.password,
      userExists.password
    );

    if (userExists.isBlocked) {
      return res.send({
        message: "Your Account is Blocked, please contact Admin",
        success: false,
        data: null,
      });
    }

    if (!passwordMatch) {
      return res.send({
        message: "Incorrect password",
        success: false,
        data: null,
      });
    }

    const token = sign(
      // we r encrypting only userId in jwt & sending encrypted form of userId nothing bt token in frontend
      { userId: userExists._id },
      process.env.jwt_secret,
      { expiresIn: "1d" }
    );

    const userName = userExists.name;
    res.send({
      message: `Welcome, ${userName}! you have successfully logged in `,
      success: true,
      data: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// get-user-by-id api

// we are getting only token  from frntend we dint no what is user id for that
// v have to decrypt token and then v have to get user id then v need perform find user by id
// then u have to send user object to frontend
// so the 1st thing v have to get user id from the token
// how to get that? --> for that v are going to write a middilware called auth middleware

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await findById(req.body.userId).select(
      "-password -_id -email -createdAt -updatedAt -__v"
    );
    res.send({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// reset password api
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate email and new password (add more validation if needed)
    // Check if the user with the provided email exists
    const user = await findOne({ email });

    if (!user) {
      return res.send({
        message: "User with the provided email does not exist",
        success: false,
        data: null,
      });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the user's password in the database
    await findByIdAndUpdate(user._id, { password: hashedPassword });

    res.send({
      message: "Password reset successful",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// get all users
router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await find({});
    res.send({
      message: "User fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// update user

router.post("/update-user-permissions", authMiddleware, async (req, res) => {
  try {
    const { _id, action } = req.body;

    let updateFields = {};

    // Determine update based on action
    if (action === "make-admin") {
      updateFields = { isAdmin: true };
    } else if (action === "remove-admin") {
      updateFields = { isAdmin: false };
    } else if (action === "block") {
      updateFields = { isBlocked: true };
    } else if (action === "unblock") {
      updateFields = { isBlocked: false };
    } else {
      return res.status(400).send({
        message: "Invalid action",
        success: false,
        data: null,
      });
    }

    // Update user
    const updatedUser = await findByIdAndUpdate(
      _id,
      updateFields,
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).send({
        message: "User not found",
        success: false,
        data: null,
      });
    }

    res.send({
      message: "User permissions updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

export default router;
