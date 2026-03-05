const express = require("express");
const router = express.Router();
const songControllers = require("../controllers/songController.js");
const authenticateToken = require("../middleware/authenticateToken.js");
const { upload } = require("../middleware/multer.js");

router.post("/get-audio-signature", authenticateToken, songControllers.getAudioSignature);
router.post("/save-song", authenticateToken, songControllers.saveSong);
router.post("/upload", authenticateToken, upload.single("my-audio"), songControllers.uploadAudio);
router.get("/getPublicSongs", songControllers.getPublicSongs);
router.patch("/addLike", authenticateToken, songControllers.addLike);
router.patch("/addPlayCount", authenticateToken, songControllers.addPlayCount);
router.get("/likedSongs", authenticateToken, songControllers.likedSongs);
router.get("/search", authenticateToken, songControllers.getSearchSongs);
router.get("/getMySongs", authenticateToken, songControllers.getMySongs);

module.exports = router;