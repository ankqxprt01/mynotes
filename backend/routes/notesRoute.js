import { Router } from "express";
import Note from "../models/noteModel.js";
import User from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authenticateToken from "../middlewares/noteMiddleware.js";

const router = Router();

// ADD NOTE
router.post("/add-note", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const newNote = new Note({
      ...req.body,
      user: userId,
    });

    await newNote.save();

    res.status(200).send({
      success: true,
      message: "Note added successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// GET NOTES

router.post("/get-note", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const notes = await Note.find({
      user: userId,
    });

    res.status(200).send({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE NOTE

router.post("/update-note", authenticateToken, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.body._id,
        user: req.userId,
      },
      {
        title: req.body.title,
        content: req.body.content,
        Notedate: new Date(),
      },
      { new: true },
    );

    if (!updatedNote) {
      return res.status(404).send({
        success: false,
        message: "Note not found",
      });
    }

    res.send({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// DELETE NOTE

router.post("/delete-note", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    await Note.findByIdAndDelete(req.body._id, {
      user: userId,
    });

    res.status(200).send({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// RECENT NOTES

router.post("/recent", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const notes = await Note.find({
      user: userId,
    });

    res.status(200).send({
      success: true,
      message: "User's notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    console.error("Error fetching user notes:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
