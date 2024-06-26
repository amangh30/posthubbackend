// models/Post.js
import mongoose from 'mongoose';

const multimediaSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  edited: { type: Boolean, default: false },
  reply: { type: Boolean, default: false },
  multimedia: [multimediaSchema],
  timestamp: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
