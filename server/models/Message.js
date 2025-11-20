import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: String,
  senderId: String,
  message: String,
  to: String, // for private messages
  isPrivate: Boolean,
  timestamp: { type: Date, default: Date.now },
  readBy: [String], // array of socketIds who read
});

export default mongoose.model("Message", messageSchema);
