import React, { useEffect, useState } from "react";
import { Table, message, Tag, Space, Button } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.post("/api/users/get-all-users", {});
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const updateUserPermissions = async (user, action) => {
    try {
      const payload = {
        _id: user._id,
        action: action,
      };

      const response = await axiosInstance.post(
        "/api/users/update-user-permissions",
        payload,
      );
      if (response.data.success) {
        getUsers(); // Refresh user list after update
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Blocked" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Role",
      key: "isAdmin",
      dataIndex: "isAdmin",
      render: (isAdmin) => (
        <Tag color={isAdmin ? "blue" : "green"}>
          {isAdmin ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {record.isBlocked ? (
            <>
              <Button onClick={() => updateUserPermissions(record, "unblock")}>
                Unblock
              </Button>
              <Button
                onClick={() => updateUserPermissions(record, "make-admin")}
              >
                Make Admin
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => updateUserPermissions(record, "block")}
                disabled={record.isAdmin}
              >
                Block
              </Button>
              {record.isAdmin ? (
                <Button
                  onClick={() => updateUserPermissions(record, "remove-admin")}
                >
                  Remove Admin
                </Button>
              ) : (
                <Button
                  onClick={() => updateUserPermissions(record, "make-admin")}
                >
                  Make Admin
                </Button>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id} // Assuming each user object has an _id field
      />
    </div>
  );
}

export default AdminUsers;
