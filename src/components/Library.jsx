import React from 'react'
import { useAuthContext } from "../authentication/Auth";
import songImage1 from '../assets/songCard1.png'
import heart2 from "../assets/heart2.png"
import { Link } from 'react-router-dom';

const Library = () => {
  const { songsData ,likedSongs,searchInput, handleSearch} = useAuthContext();

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto ">
      <h4 className="text-xl sm:text-2xl p-2 mt-4 font-bold">Your Library</h4>
      <div className="mt-6 flex flex-col gap-5">
        <Link to="/dashboard/likedSongs" onClick={()=>handleSearch("")} className="focus:outline-none">
          <div className="flex items-center gap-4 bg-gray-700 hover:bg-gray-600 transition rounded-2xl px-3 py-3 shadow-md">
            <img className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0" src={heart2} alt="" />
            <div className="flex flex-col">
              <h5 className="text-base md:text-lg font-semibold">Your Liked Songs</h5>
              <h6 className="font-medium text-sm md:text-base text-gray-300">Playlist – {likedSongs.length} Songs</h6>
            </div>
          </div>
        </Link>
        <Link to="/Dashboard" onClick={()=>handleSearch("")}  className="focus:outline-none">
          <div className="flex items-center gap-4 bg-gray-700 hover:bg-gray-600 transition rounded-2xl px-3 py-3 shadow-md">
            <img className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0" src={songImage1} alt="" />
            <div className="flex flex-col">
              <h5 className="text-base md:text-lg font-semibold">Trending Songs</h5>
              <h6 className="font-medium text-sm md:text-base text-gray-300">Total – {songsData.length} Songs</h6>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Library
