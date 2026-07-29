// NewNoteForm.js

import React from "react";
import { Col, Form, Input, Modal, Row, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { axiosInstance } from "../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

// const NewNoteForm = ({ addNote }) => {
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');

//     const handleSubmit = async (e) => {
//       e.preventDefault();

//       try {
//         // 3rd step V
//         const response = await fetch('api/notes/add-note', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ title, content }),
//         });

//         if (response.ok) {
//           const newNote = await response.json();
//           addNote(newNote);
//           setTitle('');
//           setContent('');
//         } else {
//           console.error('Failed to add note');
//         }
//       } catch (error) {
//         console.error('Error adding note:', error.message);
//       }
//     };

//     return (
//       <form onSubmit={handleSubmit}>
//         <label>Title:</label>
//       <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

//       <label>Content:</label>
//       <textarea value={content} onChange={(e) => setContent(e.target.value)} />

//       <button type="submit">Add Note</button>
//       </form>
//     );
//   };
function NewNoteForm({
  showNoteForm,
  setShowNoteForm,
  type = "add",
  getData,
  selectedNote,
  setSelectedNote,
}) {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === "add") {
        // every tym we have to send headers in request body that means axios.post insted
        // we create custom instance of that axios where we have headers directly so
        // we need not to put headers every time.create axioxInstance with folder name helper
        response = await axiosInstance.post("/api/notes/add-note", values);
      } else {
        response = await axiosInstance.post("/api/notes/update-note", {
          ...values,
          _id: selectedNote._id,
        });
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();

      setShowNoteForm(false);
      setSelectedNote(null);
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading);
    }
  };
  return (
    <Modal
      title={type === "add" ? "Add Note" : "Update Note"}
      open={showNoteForm}
      onCancel={() => {
        setSelectedNote(null);
        setShowNoteForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedNote}>
        <Row>
          <Col lg={20} sm={10}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please enter a title",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={20} sm={10}>
            <Form.Item
              label="Content"
              name="content"
              rules={[
                {
                  required: true,
                  message: "Please enter content",
                },
              ]}
            >
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex">
          <button type="submit" className="secondary">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default NewNoteForm;
