const express = require("express");
const router = express.Router();
const songControllers = require("../controllers/songController.js");
const authenticateToken = require("../middleware/authenticateToken.js");
const { upload } = require("../middleware/multer.js");

router.post("/get-audio-signature", authenticateToken, songControllers.getAudioSignature);
router.post("/save-song", authenticateToken, songControllers.saveSong);
router.post("/upload", upload.single("my-audio"), songControllers.uploadAudio);
router.get("/songs", authenticateToken, songControllers.songs);
router.post("/addLike", authenticateToken, songControllers.addLike);
router.post("/addPlayCount", authenticateToken, songControllers.addPlayCount);
router.get("/likedSongs", authenticateToken, songControllers.likedSongs);

module.exports = router;