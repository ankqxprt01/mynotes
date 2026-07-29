import React, { useEffect, useState } from "react";
import { Table, message, Tag, Space, Button, Grid } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";

const { useBreakpoint } = Grid;

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
        action,
      };

      const response = await axiosInstance.post(
        "/api/users/update-user-permissions",
        payload,
      );

      if (response.data.success) {
        message.success(response.data.message);
        getUsers();
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
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      responsive: ["md"], // Hide email on mobile
    },
    {
      title: "Status",
      dataIndex: "isBlocked",
      key: "isBlocked",
      width: 120,
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Blocked" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      width: 120,
      render: (isAdmin) => (
        <Tag color={isAdmin ? "blue" : "green"}>
          {isAdmin ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 220,
      render: (_, record) => (
        <Space
          orientation={isMobile ? "vertical" : "horizontal"}
          size="small"
          style={{ width: "100%" }}
        >
          {record.isBlocked ? (
            <>
              <Button
                size={isMobile ? "small" : "middle"}
                block={isMobile}
                onClick={() => updateUserPermissions(record, "unblock")}
              >
                Unblock
              </Button>

              <Button
                size={isMobile ? "small" : "middle"}
                block={isMobile}
                onClick={() => updateUserPermissions(record, "make-admin")}
              >
                Make Admin
              </Button>
            </>
          ) : (
            <>
              <Button
                danger
                size={isMobile ? "small" : "middle"}
                block={isMobile}
                disabled={record.isAdmin}
                onClick={() => updateUserPermissions(record, "block")}
              >
                Block
              </Button>

              {record.isAdmin ? (
                <Button
                  size={isMobile ? "small" : "middle"}
                  block={isMobile}
                  onClick={() => updateUserPermissions(record, "remove-admin")}
                >
                  Remove Admin
                </Button>
              ) : (
                <Button
                  size={isMobile ? "small" : "middle"}
                  block={isMobile}
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
    <div className="admin-users">
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id}
        bordered
        scroll={{ x: 900 }}
        pagination={{
          pageSize: 8,
          responsive: true,
        }}
      />
    </div>
  );
}

export default AdminUsers;
