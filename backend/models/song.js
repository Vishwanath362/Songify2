const mongoose = require("mongoose")

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String,
        required: true
    },
    coverImageUrl: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        default: null,
    },
    playCount: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    likeCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Song  = mongoose.model('Song',SongSchema);

module.exports = Song;
// {
//   "title": "Ocean Breeze",
//   "genre": "Lo-fi",
//   "audioUrl": "https://firebasestorage.googleapis.com/.../OceanBreeze.mp3",
//   "coverImageUrl": "...",
//   "visibility": "public",
//   "uploadedBy": "65f19a7cb3...",
//   "playCount": 0,
//   "likes": [],
//   "createdAt": "2025-06-28T12:00:00Z"
// }