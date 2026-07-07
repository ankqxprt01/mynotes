import { Schema, model } from "mongoose";

// creating new schema
const userSchema = new Schema(
  {
    name: {
      type: String, 
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      data: Buffer, // Store image data as a Buffer
      contentType: String, // Store content type (e.g., image/png, image/jpeg)
    },
    isBlocked : {
      type : Boolean,
      default : false,
  },
  isAdmin:{
    type:Boolean,
    required:true,
    default:false
  }
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
