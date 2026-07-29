import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { message, Card, Space, Modal, Row, Col } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";
import moment from "moment";
import { useSelector } from "react-redux";
import NewNoteForm from "../NewNoteForm";

function AdminNotes() {
  const dispatch = useDispatch();
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [viewNoteModalVisible, setViewNoteModalVisible] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);
  const { user } = useSelector((state) => state.users);

  const getNotes = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/notes/get-note", {});
      dispatch(HideLoading());

      if (response.data.success) {
        setNotes(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteNote = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/notes/delete-note", {
        _id: noteToDelete._id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        setDeleteModalVisible(false);
        getNotes();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const showDeleteModal = (note) => {
    setNoteToDelete(note);
    setDeleteModalVisible(true);
  };

  const viewNoteDetails = (note) => {
    setViewingNote(note);
    setViewNoteModalVisible(true);
  };

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ padding: "0 20px 30px", marginTop: "5rem" }}>
      <div className="notes-content">
        {user && <h1 className="text-center">Hey {user?.name}, </h1>}
        <h2 className="text-center">you can manage your notes here</h2>
        <div>
          <i
            className="bx bx-edit-alt"
            onClick={() => setShowNoteForm(true)}
          ></i>

          <Row gutter={[16, 16]}>
            {notes.length > 0 ? (
              notes.map((note) => (
                <Col key={note._id} xs={24} sm={8}>
                  <div style={{ width: "100%", height: "100%" }}>
                    <Card
                      title={
                        <span>
                          <b>Title :</b> {note.title}
                        </span>
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "10px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Content : {note.content}
                        </p>
                      </div>
                      <div>
                        <p>
                          Created Date:{" "}
                          {moment(note.Notedate).format("DD-MM-YYYY")}
                        </p>
                        <Space>
                          <i
                            className="bx bx-show show"
                            onClick={() => viewNoteDetails(note)}
                          ></i>
                          <i
                            className="bx bx-trash-alt trash"
                            onClick={() => showDeleteModal(note)}
                          ></i>
                          <i
                            className="bx bx-edit show"
                            onClick={() => {
                              setSelectedNote(note);
                              setShowNoteForm(true);
                            }}
                          ></i>
                        </Space>
                      </div>
                    </Card>
                  </div>
                </Col>
              ))
            ) : (
              <div className="no-notes">No notes available.</div>
            )}
          </Row>

          {showNoteForm && (
            <NewNoteForm
              showNoteForm={showNoteForm}
              setShowNoteForm={setShowNoteForm}
              type={selectedNote ? "edit" : "add"}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              getData={getNotes}
            />
          )}

          <Modal
            title="Confirm Delete"
            open={deleteModalVisible}
            onOk={deleteNote}
            onCancel={() => setDeleteModalVisible(false)}
            okText="Delete"
            cancelText="Cancel"
          >
            <p>Are you sure you want to delete this note?</p>
          </Modal>

          <Modal
            title="Note Details"
            open={viewNoteModalVisible}
            onCancel={() => setViewNoteModalVisible(false)}
            footer={null}
          >
            {viewingNote && (
              <div>
                <p>
                  <b>Title : </b> {viewingNote.title}
                </p>
                <p>
                  <b>Content : </b> {viewingNote.content}
                </p>
                <p>
                  <b>Created Date : </b>{" "}
                  {moment(viewingNote.Notedate).format("DD-MM-YYYY")}
                </p>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminNotes;
