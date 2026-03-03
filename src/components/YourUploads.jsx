import React, { useEffect, useState } from "react";
import { useAuthContext } from "../authentication/Auth";
import songImage1 from '../assets/songCard1.png'
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const YourUploads = () => {
  const navigate = useNavigate();
  const {
    appendSongs,
    token,
    userID,
    addLike,
    addPlayCount,
    API_BASE_URL,
    yourSongsData
  } = useAuthContext();

  const [durations, setDurations] = useState({});

  const handleLike = async (songId) => {
    await addLike(songId);
    await appendSongs();
  };

  const handlePlayCount = async (songId) => {
    await addPlayCount(songId);
    await appendSongs();
  };

  function formatDuration(sec) {
    if (!sec || isNaN(sec)) return "--:--";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  //  const YourSongList = (songsData || []).filter(song => song.uploadedBy === userID);
  // let yourSongsData = [];
  

  return (
    <div className="h-auto w-full bg-gradient-to-br from-gray-950 via-gray-900 to-green-900 p-3 sm:p-6 ml-0 md:ml-3 rounded-xl md:rounded-2xl shadow-xl border border-gray-700/30">
      <div className="flex flex-col w-full">
        <div className="mb-8">
          <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Songs</h4>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
        {yourSongsData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {yourSongsData.map((song) => (
              <div
                key={song._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg md:rounded-xl p-4 md:p-5 flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 border border-gray-700/50 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative overflow-hidden rounded-lg md:rounded-xl mb-3 md:mb-4 aspect-square group-hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={songImage1}
                    alt={song.title || "Song"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="mb-3 md:mb-4 relative z-10 flex justify-between items-center">
                  <div className="flex-grow">
                    <h5 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
                      {song.title || "Untitled"}
                    </h5>
                    <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-1 md:mb-2">
                      <span className="font-bold text-white">
                        by {song.userName || "Unknown Artist"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleLike(song._id)}
                    className="group/heart p-3 md:p-5 rounded-full"
                  >
                    {song.likedBy?.includes(userID) ? (
                      <Heart className="text-red-500 fill-red-500" />
                    ) : (
                      <Heart className="text-white" />
                    )}
                  </button>
                </div>
                <div className="relative z-10">
                  <audio
                    onEnded={() => { handlePlayCount(song._id) }}
                    controls
                    className="w-full h-10 md:h-12 rounded-lg shadow-inner"
                    style={{
                      filter: 'brightness(0.9) contrast(1.1)',
                      background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                    }}
                    preload="metadata"
                    onLoadedMetadata={e =>
                      setDurations(d => ({
                        ...d,
                        [song._id]: e.target.duration
                      }))
                    }
                  >
                    <source src={song.audioUrl} type="audio/mpeg" />
                    <source src={song.audioUrl} type="audio/wav" />
                    <source src={song.audioUrl} type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="flex justify-between items-center mt-2 md:mt-3 text-xs text-gray-500 relative z-10">
                  <span>Duration: {formatDuration(durations[song._id])}</span>
                  <span>♪ {song.playCount} plays</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-16 md:mt-20 text-center px-3 md:px-0">
            <div className="w-16 md:w-24 h-16 md:h-24 mb-5 md:mb-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-400 mb-1 md:mb-2">No Uploads Yet</h2>
            <p className="text-gray-500 max-w-xs md:max-w-md text-sm md:text-base">
              You haven't uploaded any songs yet. Share your music to see them here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourUploads;
