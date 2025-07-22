import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../authentication/Auth";

const UploadAudio = () => {
  const { userID, userName, appendSongs } = useAuthContext();
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [visibility, setVisibility] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (!audioFile || !userID) return;
    try {
      const publicId = `${userID}-${audioFile.name}`;
      const signatureResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/get-audio-signature`, { public_id: publicId });
      const { timestamp, signature, apiKey, cloudName } = signatureResponse.data;
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("api_key", apiKey);
      formData.append("public_id", publicId);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      setUploading(true);
      setUploadStatus("");
      setUploadProgress(0);
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      setAudioUrl(uploadResponse.data.secure_url);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/save-song`, {
        title,
        genre,
        visibility,
        audioUrl: uploadResponse.data.secure_url,
        userID,
        userName
      });
      setUploadStatus("✅ Upload successful!");
      setUploadProgress(100);
      await appendSongs();
    } catch (err) {
      setUploadStatus("❌ Upload failed. Please try again.");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setUploadStatus("");
      setUploadProgress(0);
    } else {
      setUploadStatus("Please select an audio file");
      setAudioFile(null);
    }
  };

  const handleClear = () => {
    setAudioFile(null);
    setUploadStatus("");
    setTitle("");
    setGenre("");
    setVisibility("");
    setAudioUrl(null);
    setUploadProgress(0);
    document.getElementById("title-input").value = "";
    document.getElementById("genre-input").value = "";
    document.getElementById("visibility-select").selectedIndex = 0;
    document.getElementById("audio-input").value = "";
  };

  const isFormValid = audioFile && userID && title && genre && visibility;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-2 sm:px-4 md:px-10 py-10 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Upload Your Track</h2>
        <p className="text-gray-400">Share your music with the world</p>
      </div>
      <div className="mb-8">
        <label className="block text-gray-300 text-sm font-medium mb-3">
          Select Audio File
        </label>
        <div className="relative">
          <input
            id="audio-input"
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className={`
            border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300
            ${audioFile 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
            }
          `}>
            {audioFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-400 font-medium break-all">{audioFile.name}</p>
                <p className="text-gray-400 text-sm">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-300 font-medium">Click to select audio file</p>
                <p className="text-gray-500 text-sm">MP3, WAV, FLAC up to 100MB</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Song Title
          </label>
          <input
            id="title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Genre
          </label>
          <input
            id="genre-input"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Enter genre"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Visibility
          </label>
          <select
            id="visibility-select"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select visibility</option>
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
          </select>
        </div>
      </div>
      {uploading && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Upload Progress</span>
            <span className="text-sm text-blue-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      {uploadStatus && (
        <div className={`
          p-4 rounded-xl mb-6 text-center font-medium
          ${uploadStatus.includes('✅') 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }
        `}>
          {uploadStatus}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleUpload}
          disabled={!isFormValid || uploading}
          className={`
            flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform
            ${isFormValid && !uploading
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Track
            </span>
          )}
        </button>
        <button
          onClick={handleClear}
          disabled={uploading}
          className={`
            flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300
            ${uploading
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500'
            }
          `}
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </span>
        </button>
      </div>
      {audioUrl && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">Preview</h3>
              <p className="text-gray-400 text-sm">Your uploaded track</p>
            </div>
          </div>
          <audio 
            controls 
            className="w-full h-12 bg-gray-700 rounded-lg"
            style={{ filter: 'sepia(20%) saturate(70%) hue-rotate(180deg) brightness(80%) contrast(120%)' }}
          >
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default UploadAudio;
