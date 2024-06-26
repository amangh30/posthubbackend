import express from 'express';
import Post from '../models/Post.js';
import upload from '../config/uploadConfig.js'; // Import multer configuration

const router = express.Router();

router.post('/posts', upload.array('files'), async (req, res) => {
  try {
    console.log('Files received:', req.files);
    const { text, edited, reply } = req.body;

    const multimedia = req.files.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    console.log('Multimedia data:', multimedia);  // Log multimedia data

    const post = new Post({
      text,
      edited: edited || false,
      reply: reply || false,
      multimedia
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Prepare response with multimedia files
    const multimediaFiles = post.multimedia.map(file => ({
      contentType: file.contentType,
      data: file.data.toString('base64')  // Convert Buffer to base64 string
    }));

    res.json({
      post: {
        _id: post._id,
        text: post.text,
        edited: post.edited,
        reply: post.reply,
        timestamp: post.timestamp,
        multimedia: multimediaFiles
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;