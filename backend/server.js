import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import "./config/dbConfig.js";

import usersRoute from "./routes/usersRoute.js";
import notesRoute from "./routes/notesRoute.js";


const app = express();

const port = process.env.PORT || 5001;


// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


// Root route
app.get("/", (req, res) => {
  console.log("ROOT ROUTE HIT");
  res.send("My Notes API Server is running 🚀");
});


// API routes
app.use("/api/users", usersRoute);
app.use("/api/notes", notesRoute);


// Start server
app.listen(port, () => {
  console.log(
    `Node server listening on http://localhost:${port}`
  );
});