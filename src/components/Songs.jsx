import React, { useState } from "react";
import { useAuthContext } from "../authentication/Auth";
import songImage1 from '../assets/songCard1.png'
import { Heart, Play, Music, TrendingUp, Users, Clock } from "lucide-react";

const Songs = () => {
  const { songsData, appendSongs, token, getLikedSongs, userID, addLike, addPlayCount } = useAuthContext();
  const [durations, setDurations] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [loadingLike, setLoadingLike] = useState(null);

  const handleLike = async (songId) => {
    setLoadingLike(songId);
    try {
      await addLike(songId);
      await appendSongs();
    } finally {
      setLoadingLike(null);
    }
  };

  const handlePlayCount = async (songId) => {
    await addPlayCount(songId);
    await appendSongs();
  }

  function formatDuration(sec) {
    if (!sec || isNaN(sec)) return "--:--";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
   <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-green-900 px-2 sm:px-4 md:px-6 py-3 md:py-6 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-700/30 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-64 md:w-80 h-64 md:h-80 bg-slate-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-64 md:w-80 h-64 md:h-80 bg-gray-500/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 flex flex-col py-1 px-1 md:p-2 h-auto w-full">
        <div className="mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-3 md:mb-4 flex-wrap">
            <div className="p-2 md:p-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl md:rounded-2xl shadow-lg">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-slate-200" />
            </div>
            <div>
              <h4 className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2">
                Trending Songs
              </h4>
              <p className="text-slate-400 text-base md:text-lg">Discover the hottest tracks right now</p>
            </div>
          </div>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-slate-500 to-slate-400 rounded-full shadow-lg"></div>
        </div>
        
        {songsData && songsData.length > 0 ? (
          <div className="flex flex-col gap-4 md:gap-6 w-full">
            {songsData.filter(song => song.visibility === 'public').map((song, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-gray-900/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl hover:shadow-slate-500/20 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] border border-slate-700/50 hover:border-slate-600/70 overflow-hidden"
              >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-600/8 via-transparent to-slate-500/8 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12"></div>
                
                {/* Horizontal Layout */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 relative z-10">
                  {/* Album Art Section */}
                  <div className="flex-shrink-0 w-full sm:w-32 md:w-40 lg:w-48">
                    <div className="relative overflow-hidden rounded-lg md:rounded-xl aspect-square shadow-2xl group-hover:shadow-slate-500/30 transition-shadow duration-500">
                      <img
                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=faces"
                        alt={song.title || "Song"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="p-2 md:p-3 bg-slate-800/80 backdrop-blur-md rounded-full border border-slate-600/50 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                          <Play className="w-4 h-4 md:w-6 md:h-6 text-slate-200 fill-slate-200" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-600/30">
                        <Music className="w-3 h-3 text-slate-300 inline mr-1" />
                        <span className="text-xs text-slate-300 font-semibold">Trending</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    {/* Song Info and Like Button */}
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div className="flex-grow min-w-0 pr-2 md:pr-4">
                        <h5 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 truncate group-hover:text-slate-200 transition-all duration-300">
                          {song.title || "Untitled"}
                        </h5>
                        <div className="flex items-center gap-1 md:gap-2 mb-2">
                          <Users className="w-3 h-3 md:w-4 md:h-4 text-slate-500 flex-shrink-0" />
                          <p className="text-sm md:text-base text-slate-400 group-hover:text-slate-300 transition-colors duration-300 truncate">
                            <span className="font-bold text-slate-300">
                              {song.userName || "Unknown Artist"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLike(song._id)}
                        disabled={loadingLike === song._id}
                        className="group/heart relative p-2 md:p-3 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-red-400/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-400/20 flex-shrink-0"
                      >
                        {loadingLike === song._id ? (
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            {song.likedBy?.includes(userID) ? (
                              <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-400 fill-red-400 drop-shadow-lg" />
                            ) : (
                              <Heart className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-hover/heart:text-red-400 transition-colors duration-300" />
                            )}
                          </>
                        )}
                        <div className="absolute inset-0 rounded-full bg-red-400/10 scale-0 group-hover/heart:scale-100 transition-transform duration-300"></div>
                      </button>
                    </div>

                    {/* Audio Player - Wider */}
                    <div className="mb-3 md:mb-4">
                      <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-0.5 md:p-1 shadow-inner">
                        <audio
                          onEnded={() => { handlePlayCount(song._id) }}
                          controls
                          className="w-full h-10 md:h-14 rounded-lg bg-transparent"
                          style={{
                            filter: 'brightness(1.1) contrast(1.1)',
                          }}
                          preload="metadata"
                          onLoadedMetadata={e =>
                            setDurations(d => ({ ...d, [song._id]: e.target.duration }))
                          }
                        >
                          <source src={song.audioUrl} type="audio/mpeg" />
                          <source src={song.audioUrl} type="audio/wav" />
                          <source src={song.audioUrl} type="audio/ogg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="flex justify-between items-center text-xs md:text-sm text-slate-400 pt-2 md:pt-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="font-medium">{formatDuration(durations[song._id])}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 bg-slate-700/30 rounded-full border border-slate-600/30">
                        <Play className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current text-slate-400" />
                        <span className="font-bold text-slate-300">
                          {song.playCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 md:mt-20 text-center relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <Music className="w-40 h-40 md:w-96 md:h-96 text-slate-500" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 md:w-32 md:h-32 mb-5 md:mb-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center shadow-2xl">
                <Music className="w-10 h-10 md:w-16 md:h-16 text-slate-200" />
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4">
                No Songs Available
              </h2>
              <p className="text-slate-400 max-w-sm md:max-w-md text-base md:text-lg leading-relaxed">
                It looks like there are no trending songs at the moment.
                <br />
                <span className="text-slate-300 font-semibold">
                  Check back later for the latest hits!
                </span>
              </p>
              <div className="mt-4 md:mt-8 flex gap-2 justify-center">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Songs;
