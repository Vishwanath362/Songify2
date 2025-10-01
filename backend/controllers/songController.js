const Song = require("../models/song.js");
const User = require("../models/users.js");
const cloudinary = require("cloudinary").v2;

const getAudioSignature = async (req, res) => {
  try {
    const { public_id } = req.body;
    const timestamp = Math.floor(Date.now() / 1000);

    // Use only required parameters for raw upload
    const params = {
      public_id: public_id,
      //resource_type: "video",
      timestamp: timestamp,
    };

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
    return res.status(500).json({ error: "Failed to generate signature", details: error.message });
  }
};


const saveSong = async (req, res) => {
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
    return res.status(500).json({ error: "Failed to save song" });
  }
};

const uploadAudio = async (req, res) => {
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

    return res.json({
      success: true,
      url: uploadResult.secure_url,
      songId: song._id
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
};




const songs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ playCount: -1 });
    return res.status(200).send(songs);

  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "no data" })
  }
};




const addLike = async (req, res) => {
  const { songId } = req.body;
  const userId = req.user.id;

  try {
    // console.log("addLike endpoint - songId:", songId, "userId:", userId);

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


      return res.status(200).json({
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
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};




const addPlayCount = async (req, res) => {
  const { songId } = req.body;
  const userId = req.user.id;

  try {

    const song = await Song.findById(songId);
    const user = await User.findById(userId);

    if (!song || !user) {
      console.log("song or user error");

    }
    await Song.findByIdAndUpdate(songId,
      { $inc: { playCount: 1 } })

    return res.status(200).json({
      message: "Playcount inceased successfully"

    });
  }
  catch (err) {
    console.error("Error in addPlaycount endpoint:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};




const likedSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('likedSongs');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      likedSongs: user.likedSongs || []
    });
  } catch (err) {
    console.error("Error fetching liked songs:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const getSearchSongs = async (req, res) => {
  try {
    const query = req.query.q || "";
    const songs = await Song.find({
      title: { $regex: query, $options: "i" },
    });

    res.status(200).json(songs);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Server error while searching" });
  }
};

module.exports = {
  getAudioSignature,
  saveSong,
  uploadAudio,
  songs,
  addLike,
  addPlayCount,
  likedSongs,
  getSearchSongs
};