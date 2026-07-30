import React, { useEffect, useState } from "react";
import { Card, Avatar, Typography, Empty, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { ShowLoading, HideLoading } from "../../redux/alertsSlice";

const { Title, Text } = Typography;

function AdminusersNotes() {
  const dispatch = useDispatch();
  const [usersNotes, setUsersNotes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const getAllNotes = async () => {
    dispatch(ShowLoading());

    try {
      const response = await axiosInstance.post(
        "/api/notes/get-all-notes-admin",
        {},
      );

      if (response.data.success) {
        setUsersNotes(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (err) {
      message.error(err.message);
    }

    dispatch(HideLoading());
  };

  useEffect(() => {
    getAllNotes();
    document.title = "Admin Users Notes";
  }, []);

  const formatDate = (date) => {
    if (!date) return "No Date";

    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="admin-users-card">
      {usersNotes.map((user) => (
        <div className="user-card" key={user.userId}>
          <div className="user-header">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                onClick={() => setSelectedImage(user.profileImage)}
                className="profile-img"
              />
            ) : (
              <div>{user.name?.charAt(0)}</div>
            )}

            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span>{user.notes.length} Notes</span>
            </div>

            {selectedImage && (
              <div
                className="image-modal"
                onClick={() => setSelectedImage(null)}
              >
                <img src={selectedImage} alt={user.name} />
              </div>
            )}
          </div>

          <div className="notes-list">
            {user.notes.map((note) => (
              <div className="note-card" key={note._id}>
                <h4>{note.title}</h4>
                <p>{note.content}</p>
                <small>{formatDate(note.Notedate)}</small>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminusersNotes;
