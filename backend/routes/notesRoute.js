import { Router } from "express";
const router = Router();
import Note from "../models/noteModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authenticateToken from "../middlewares/noteMiddleware.js";
// User model to add ,get notes with help of email in user model

// to add new note
// adding values to mongodb via post

// add note
router.post("/add-note", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user details (assuming User model has 'email' field)
    const user = await findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const newNote = new Note({
      ...req.body,
      user: userId, // Assigning the user's ID to the 'user' field of the note
    });

    await newNote.save();

    return res.status(200).send({
      success: true,
      message: "Note added successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// get note
router.post("/get-note", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user details (assuming User model has 'email' field)
    const user = await findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Retrieve notes for the specific user's ID
    const notes = await find({ user: userId });

    return res.status(200).send({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post("/update-note", authMiddleware, async (req, res) => {
  try {
    // Get the current timestamp
    const currentDate = new Date();

    // Update the note with the current timestamp
    const updatedNote = {
      ...req.body,
      Notedate: currentDate,
    };

    await findByIdAndUpdate(req.body._id, updatedNote);

    return res.status(200).send({
      success: true,
      message: "Note updated successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// delete note
router.post("/delete-note", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    await findByIdAndDelete(req.body._id, { user: userId });
    return res.status(200).send({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post("/recent", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Retrieve notes for the specific user's ID
    const notes = await find({ user: userId });

    return res.status(200).send({
      success: true,
      message: "User's notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    console.error('Error fetching user notes:', error);
    res.status(500).send({ success: false, message: error.message });
  }
});

export default router;
