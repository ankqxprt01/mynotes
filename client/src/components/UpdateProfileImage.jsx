import React, { useState, useEffect } from "react";
import { axiosInstance } from "../helpers/axiosInstance";
import {
  Upload,
  Button,
  message,
  Popconfirm,
  Input,
  Card,
  Typography,
  Avatar,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";

const { Title, Text } = Typography;

const UpdateProfileImage = ({ onImageUpload }) => {
  const { user } = useSelector((state) => state.users);

  const [fileList, setFileList] = useState([]);
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (user) {
      setOldName(user.name || "");

      setImageUploaded(!!user.profileImage);

      if (user.profileImage) {
        setImageUrl(
          `http://localhost:5001/api/users/profile-image/${user._id}?t=${Date.now()}`,
        );
      }
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleChange = (info) => {
    let files = [...info.fileList];

    files = files.slice(-1);

    setFileList(files);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      toast.error("Select image");

      return;
    }

    const formData = new FormData();

    formData.append("profileImage", fileList[0].originFileObj);

    try {
      const loading = toast.loading("Uploading...");

      await axiosInstance.post("/api/users/update-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Image uploaded", {
        id: loading,
      });

      setImageUrl(
        `http://localhost:5001/api/users/profile-image/${user._id}?t=${Date.now()}`,
      );

      setImageUploaded(true);

      setFileList([]);

      if (onImageUpload) {
        onImageUpload();
      }
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Upload failed");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/users/delete-profile-image",
      );

      if (response.data.success) {
        message.success("Image deleted");

        setImageUrl("");

        setImageUploaded(false);

        if (onImageUpload) {
          onImageUpload();
        }
      }
    } catch (error) {
      console.log(error.response?.data);

      message.error("Delete failed");
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      toast.error("Enter new name");

      return;
    }

    try {
      const response = await axiosInstance.post("/api/users/updateName", {
        newName,
      });

      if (response.data.success) {
        toast.success("Name updated");

        setOldName(newName);

        setNewName("");
      }
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Name update failed");
    }
  };

  return (
    <div className="profile-wrapper">
      <Toaster position="top-center" />

      <Card className="profile-card">
        <div className="profile-content">
          <Title level={3}>Profile Settings</Title>

          <div className="profile-avatar">
            <Avatar
              size={120}
              src={imageUrl}
              icon={!imageUrl && <UserOutlined />}
            />
          </div>

          <div className="name-section">
            <Text strong>Current Name</Text>

            <Input className="profile-input" value={oldName} disabled />
          </div>

          <div className="name-section">
            <Text strong>New Name</Text>

            <Input
              className="profile-input"
              placeholder="Enter new name"
              prefix={<EditOutlined />}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <Button
              className="profile-btn"
              type="primary"
              onClick={handleNameUpdate}
            >
              Update Name
            </Button>
          </div>

          <div className="image-section">
            <Upload
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button className="profile-btn" icon={<UploadOutlined />}>
                Select Image
              </Button>
            </Upload>

            <Button
              className="profile-btn"
              type="primary"
              onClick={handleUpload}
            >
              Upload Image
            </Button>

            {imageUploaded && (
              <Popconfirm
                title="Delete image?"
                description="Are you sure?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  className="profile-btn"
                  icon={<DeleteOutlined />}
                >
                  Delete Image
                </Button>
              </Popconfirm>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UpdateProfileImage;
