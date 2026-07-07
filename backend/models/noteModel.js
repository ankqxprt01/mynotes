import { Schema, model } from "mongoose";
// 1st step-M
// creating new schema
const noteSchema = new Schema(
  {
    title: {
      type: String, 
      required:true,
      
    },
    content: {
      type: String,
      required:true,
    },
    Notedate:{
        type:Date,
        default:Date.now,
    },

    // this is user to add notes with the email signin by user eg:abc@tm.io 
    // it will add note and it seen by him not by others
    user: {
      type: String,
      required: true,
    },
   
  },
 
);

export default model("Note", noteSchema);
