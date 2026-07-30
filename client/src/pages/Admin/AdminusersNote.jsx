import React, { useEffect, useState } from "react";
import { Table, message, Avatar } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";

function AdminusersNotes() {
  const dispatch = useDispatch();
  const [usersNotes, setUsersNotes] = useState([]);

  const getAllNotes = async () => {
    dispatch(ShowLoading());
    try {
      const response = await axiosInstance.post(
        "/api/notes/get-all-notes-admin",
        {},
      );
      dispatch(HideLoading());

      if (response.data.success) {
        setUsersNotes(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  const formatDate = (date) => {
    if (!date) return "No Date";

    const d = new Date(date);

    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const columns = [
    {
      title: "Profile",
      key: "profileImage",
      width: 100,

      render: (record) => (
        <Avatar size={50} src={record.profileImage}>
          {record.name?.charAt(0)}
        </Avatar>
      ),
    },

    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },

    {
      title: "Total Notes",
      key: "notes",
      width: 120,

      render: (record) => record.notes.length,
    },

    {
      title: "Latest Note Date",
      key: "latestDate",
      width: 170,

      render: (record) => {
        if (!record.notes.length) return "No Date";

        const latestNote = record.notes[record.notes.length - 1];

        return formatDate(latestNote.Notedate);
      },
    },
  ];

  useEffect(() => {
    document.title = "Admin Users Notes";
  }, []);

  return (
    <div className="adm-usr_nt">
      <Table
        columns={columns}
        dataSource={usersNotes}
        rowKey="userId"
        scroll={{
          x: 800,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              pagination={false}
              rowKey="_id"
              dataSource={record.notes}
              scroll={{
                x: 800,
              }}
              columns={[
                {
                  title: "Profile",
                  width: 100,

                  render: () => (
                    <Avatar size={40} src={record.profileImage}>
                      {record.name?.charAt(0)}
                    </Avatar>
                  ),
                },

                {
                  title: "User Name",
                  width: 150,

                  render: () => record.name,
                },

                {
                  title: "Title",
                  dataIndex: "title",
                  key: "title",
                  width: 180,
                },

                {
                  title: "Content",
                  dataIndex: "content",
                  key: "content",
                  width: 300,
                },

                {
                  title: "Date",
                  dataIndex: "Notedate",
                  key: "Notedate",
                  width: 150,

                  render: (date) => formatDate(date),
                },
              ]}
            />
          ),
        }}
      />
    </div>
  );
}

export default AdminusersNotes;
