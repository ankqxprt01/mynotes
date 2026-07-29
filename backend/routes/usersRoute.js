import { Router } from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware.js";
import ProfileMiddleware from "../middlewares/ProfileMiddleware.js";
import multer from "multer";

const router = Router();

const { hash, compare } = bcrypt;
const { sign } = jwt;

const upload = multer();

// REGISTER
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.send({
        message: `${existingUser.name} already exists`,
        success: false,
        data: null,
      });
    }

    const hashedPassword = await hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    if (req.file) {
      newUser.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await newUser.save();

    res.send({
      message: "User Created Successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// GET PROFILE IMAGE

router.post("/profileImage", ProfileMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user || !user.profileImage || !user.profileImage.data) {
      return res.status(404).send({
        success: false,
        message: "Profile image not found",
      });
    }

    res.set("Content-Type", user.profileImage.contentType);

    res.send(user.profileImage.data);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// update image
router.post(
  "/update-profile-image",
  ProfileMiddleware,
  upload.single("profileImage"),

  async (req, res) => {
    try {
      // console.log("USER ID:", req.userId);
      // console.log("FILE:", req.file);

      const existingUser = await User.findById(req.userId);

      if (!existingUser) {
        return res.status(404).send({
          message: "User not found",
          success: false,
          data: null,
        });
      }

      if (!req.file) {
        return res.status(400).send({
          message: "Please upload image",
          success: false,
        });
      }

      existingUser.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };

      await existingUser.save();

      res.status(200).send({
        message: "Profile image updated successfully",

        success: true,

        data: {
          user: existingUser,
        },
      });
    } catch (error) {
      console.log("UPLOAD ERROR:", error);

      res.status(500).send({
        message: error.message,

        success: false,

        data: null,
      });
    }
  },
);

router.get("/profile-image/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.profileImage) {
      return res.status(404).send("No image");
    }

    res.contentType(user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// update name
router.post("/updateName", authMiddleware, async (req, res) => {
  try {
    const { newName } = req.body;

    // user comes from JWT middleware
    const existingUser = await User.findById(req.userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    existingUser.name = newName;

    await existingUser.save();

    res.json({
      message: "User name updated successfully",
      success: true,
      data: existingUser,
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
    const userId = req.userId; // <-- ADD THIS

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
        data: null,
      });
    }

    user.profileImage = undefined;

    await user.save();

    res.send({
      message: "Profile image deleted successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    const userExists = await User.findOne({
      email: req.body.email,
    });

    if (!userExists) {
      return res.send({
        message: "User does not exists",
        success: false,
        data: null,
      });
    }

    const passwordMatch = await compare(req.body.password, userExists.password);

    if (!passwordMatch) {
      return res.send({
        message: "Incorrect password",
        success: false,
        data: null,
      });
    }

    if (userExists.isBlocked) {
      return res.send({
        message: "Your Account is Blocked",
        success: false,
        data: null,
      });
    }

    const token = sign(
      {
        userId: userExists._id,
      },
      process.env.jwt_secret,
      {
        expiresIn: "1d",
      },
    );

    res.send({
      message: `Welcome ${userExists.name}`,
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

// GET USER BY ID

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -__v");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

// RESET PASSWORD

router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.send({
        message: "User does not exist",
        success: false,
        data: null,
      });
    }

    const hashedPassword = await hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

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

// GET ALL USERS

router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});

    res.send({
      message: "Users fetched successfully",
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

// UPDATE USER PERMISSIONS

router.post("/update-user-permissions", authMiddleware, async (req, res) => {
  try {
    const { _id, action } = req.body;

    let updateFields = {};

    if (action === "make-admin") {
      updateFields = {
        isAdmin: true,
      };
    } else if (action === "remove-admin") {
      updateFields = {
        isAdmin: false,
      };
    } else if (action === "block") {
      updateFields = {
        isBlocked: true,
      };
    } else if (action === "unblock") {
      updateFields = {
        isBlocked: false,
      };
    } else {
      return res.status(400).send({
        message: "Invalid action",
        success: false,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updateFields, {
      new: true,
    });

    res.send({
      message: "Permissions updated",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

export default router;
