const jwt = require("jsonwebtoken")
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const Song = require("./models/song");
const authenticateToken = require('./middleware/authenticateToken');

dotenv.config({ path: '../.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cors());
const User = require("./models/users");
const { upload } = require("./middleware/multer");
const { log } = require("console");
// const data = [{
//   name: "ramesh",
//   email: "admin1@gmail.com",
//   password: "12345678"
// }, {
//   name: "r",
//   email: "a@gmail.com",
//   password: "1"
// }]
const secret = process.env.JWT_SECRET;
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,

    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id, name: newUser.name }, secret, {
      expiresIn: "1h"
    });

    return res.status(200).json({
      message: "Successfully created",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid User Credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id, name: user.name }, secret, {
        expiresIn: "1h"
      });

      return res.status(200).json({
        message: "Login Successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    } else {
      return res.status(401).json({ message: "Invalid User Credentials" });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/get-audio-signature", async (req, res) => {
  try {
    const { public_id } = req.body;
    // console.log("=== SIGNATURE GENERATION ===");
    // console.log("Public ID:", public_id);
    // console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    // console.log("API Key:", process.env.CLOUDINARY_API_KEY);
    // console.log("API Secret length:", process.env.CLOUDINARY_API_SECRET?.length);

    const timestamp = Math.floor(Date.now() / 1000);
    // console.log("Timestamp:", timestamp);

    // Use only required parameters for raw upload
    const params = {
      public_id: public_id,
      //resource_type: "video",
      timestamp: timestamp,
    };

    // console.log("Params for signature:", params);

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );


    res.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ error: "Failed to generate signature", details: error.message });
  }
});



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });



app.post("/api/save-song", async (req, res) => {
  try {
    const { title, genre, visibility, audioUrl, userID, userName } = req.body;

    if (!title || !genre || !visibility || !audioUrl || !userID) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let Visibility = visibility ? 'public' : 'private';

    const song = new Song({
      title,
      genre,
      audioUrl,
      coverImageUrl: "https://via.placeholder.com/400x400?text=Music",
      visibility: Visibility,
      uploadedBy: userID,
      userName: userName,
      playCount: 0,
      likedBy: []
    });

    await song.save();

    res.json({
      success: true,
      message: "Song saved successfully",
      songId: song._id
    });
  } catch (error) {
    console.error("Error saving song:", error);
    res.status(500).json({ error: "Failed to save song" });
  }
});

app.post("/upload", upload.single("my-audio"), async (req, res) => {
  try {
   
    const uploadResult = await cloudinary.uploader.upload(
      req.file.path, {
      resource_type: "video",
    });

    const fileName = req.file.originalname;
    const song = new Song({
      fileName,
      audioUrl: uploadResult.secure_url,
      uploadDate: new Date()
    });

    await song.save();

    // console.log("Upload successful:", uploadResult);

    res.json({
      success: true,
      url: uploadResult.secure_url,
      songId: song._id
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});


app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    return res.status(200).send(songs);

  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "no data" })
  }
})



app.post('/api/addLike', authenticateToken, async (req, res) => {
  const { songId } = req.body;
  const userId = req.user.id;

  try {
    console.log("addLike endpoint - songId:", songId, "userId:", userId);

    const song = await Song.findById(songId);
    const user = await User.findById(userId);

    if (!song) {
      console.log("Song not found with ID:", songId);
      return res.status(404).json({ message: "Song not found" });
    }

    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    const isLiked = song.likedBy.includes(userId);

    if (!isLiked) {
     
      song.likedBy.push(userId);
      song.likeCount = song.likedBy.length;
      await song.save();

     
      if (!user.likedSongs.includes(songId)) {
        user.likedSongs.push(songId);
        await user.save();
      }

      
      res.status(200).json({ 
        message: "Song liked successfully", 
        likeCount: song.likeCount,
        action: "liked"
      });
    } else {
      
      song.likedBy = song.likedBy.filter(id => !id.equals(userId));
      song.likeCount = song.likedBy.length;
      await song.save();

    
      user.likedSongs = user.likedSongs.filter(id => !id.equals(songId));
      await user.save();

      
      res.status(200).json({ 
        message: "Song unliked successfully", 
        likeCount: song.likeCount,
        action: "unliked"
      });
    }
  } catch (err) {
    console.error("Error in addLike endpoint:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


app.post('/api/addPlayCount', authenticateToken, async (req, res) => {
  const { songId } = req.body;
  const userId = req.user.id;

  try {

    const song = await Song.findById(songId);
    const user = await User.findById(userId);

    if(!song || !user) {
      console.log("song or user error");
      
    }
    await Song.findByIdAndUpdate(songId,
      {$inc:{playCount:1}})

    res.status(200).json({ 
        message: "Playcount inceased successfully"
       
      });
  } 
  catch (err) {
    console.error("Error in addPlaycount endpoint:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

app.use((err, req, res, next) => {
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

app.listen(process.env.PORT, () => console.log("✅ Proxy server running"));
