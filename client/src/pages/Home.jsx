import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { axiosInstance } from "../helpers/axiosInstance";
import moment from "moment";

function Home() {
  const { user } = useSelector((state) => state.users);
  const [recentNotes, setRecentNotes] = useState([]); // State to hold recent notes

  useEffect(() => {
    async function fetchRecentNotes() {
      try {
        const response = await axiosInstance.post("/api/notes/recent");
        if (response.data.success) {
          const latestNotes = response.data.data.slice(0, 3);
          // Sort notes by Notedate in descending order
          latestNotes.sort(
            (a, b) => new Date(b.Notedate) - new Date(a.Notedate),
          );
          setRecentNotes(latestNotes);
        } else {
          console.error("Failed to fetch recent notes:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching recent notes:", error);
      }
    }

    fetchRecentNotes();
  }, []);

  useEffect(() => {
    document.title = "anticsnotes";
  }, []);

  return (
    <div className="home-content">
      <h1>Welcome to Notes Point.</h1>

      <div className="home-user">
        {user && <h2>Hello! {user.name}.</h2>}
        Role: {user?.isAdmin ? " Admin" : "User"}
      </div>

      <div className="home-notes_text">
        <div className="new-txt">
          <h2>Wanna create some notes ?</h2>
          {/* Conditional rendering of Link based on user's role */}
          {user?.isAdmin ? (
            <Link
              className="create"
              to="/admin-notes"
              onClick={() => console.log("Create clicked")}
            >
              Create
            </Link>
          ) : (
            <Link className="create" to="/users-notes">
              Create
            </Link>
          )}
        </div>
      </div>

      <div className="recent-notes">
        <h2>Recent Notes</h2>
        <div className="recent-notes_box">
          {/* Check if recentNotes array is empty */}
          {recentNotes.length > 0 ? (
            // Map through recentNotes state to render individual note cards
            recentNotes.map((note) => (
              <div className="note-box" key={note._id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <p>{moment(note.Notedate).format("DD-MM-YYYY")}</p>
              </div>
            ))
          ) : (
            // Render a message if recentNotes array is empty
            <p>No recent notes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
