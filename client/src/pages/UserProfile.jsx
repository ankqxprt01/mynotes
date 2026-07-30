import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UpdateProfileImage from "../components/UpdateProfileImage";

const UserProfile = () => {
  const { user } = useSelector((state) => state.users);

  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    if (user?.profileImage) {
      setImageExists(true);
    } else {
      setImageExists(false);
    }
  }, [user]);

  const handleImageChange = () => {
    // refresh image state after upload/delete
    setImageExists((prev) => !prev);
    setTimeout(() => {
      setImageExists(true);
    }, 100);
  };

  useEffect(() => {
    document.title = "Profile Image";
  }, []);

  return (
    <div className="blurred-box">
      <UpdateProfileImage onImageUpload={handleImageChange} />
    </div>
  );
};

export default UserProfile;
