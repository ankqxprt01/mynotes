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
  Flex,
  Space,
  Divider,
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
        // setImageUrl(
        //   `http://localhost:5001/api/users/profile-image/${user._id}?t=${Date.now()}`,
        // );

        setImageUrl(
          `https://mynotes-ry6y.onrender.com/api/users/profile-image/${user._id}?t=${Date.now()}`,
        );
      }
    }
  }, [user]);

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

      // setImageUrl(
      //   `http://localhost:5001/api/users/profile-image/${user._id}?t=${Date.now()}`,
      // );
      setImageUrl(
        `https://mynotes-ry6y.onrender.com/api/users/profile-image/${user._id}?t=${Date.now()}`,
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
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "100vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <Toaster position="top-center" />

      <Card
        style={{
          width: 500,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,.1)",
        }}
      >
        <Flex vertical align="center" gap={10} justify="center">
          <Title level={3} style={{ margin: 0 }}>
            Profile Settings
          </Title>

          <Avatar
            size={120}
            src={imageUrl}
            icon={!imageUrl && <UserOutlined />}
          />

          <Divider style={{ margin: "8px 0" }} />

          <Flex vertical style={{ width: "100%" }} gap={8}>
            <Text strong>Current Name</Text>

            <Input value={oldName} disabled />
          </Flex>

          <Flex vertical style={{ width: "100%" }} gap={8}>
            <Text strong>New Name</Text>

            <Input
              placeholder="Enter new name"
              prefix={<EditOutlined />}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <Button type="primary" block onClick={handleNameUpdate}>
              Update Name
            </Button>
          </Flex>

          <Divider style={{ margin: "8px 0" }} />

          <Flex gap={12} style={{ width: "100%" }}>
            <Upload
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false}
              accept="image/*"
              style={{ flex: 1 }}
            >
              <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                Select Image
              </Button>
            </Upload>

            <Button type="primary" onClick={handleUpload} style={{ flex: 1 }}>
              Upload Image
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default UpdateProfileImage;
