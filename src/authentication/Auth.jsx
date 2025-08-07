import { useContext, useState, createContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { set } from "mongoose";

// Environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'https://songify-v4q3.onrender.com';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [userName, setUserName] = useState(null);
    const [userID, setUserID] = useState(null);
    const [songsData, setSongs] = useState([]);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            // console.log("Decoded token:", decoded);
            const name = decoded.name;
            const id = decoded.id;
            setUserName(name);
            setUserID(id);
        }
    }, [token]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/songs`);
               
                setSongs(response.data);
            }
            catch (err) {
                console.log("Error fetching songs:", err);
            }
        };
        fetchSongs();
    }, [])

    const handleLogin = (t) => {
        // console.log("handleLogin is working");
        // console.log(t);
        // console.log(t.name)
        localStorage.setItem("token", t);
        setToken(t);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    const appendSongs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/songs`);
            console.log("Songs refreshed:", response.data);
            setSongs(response.data);
        } catch (err) {
            console.log("Error refreshing songs:", err);
        }
    }
    const addLike = async (songId) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/addLike`,
                { songId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // console.log("Song liked:", res.data);
        } catch (error) {
            console.error("Error liking song:", error.response?.data || error.message);
        }
    };

    const addPlayCount = async(songId)=>{
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/addPlayCount`,
                { songId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.log(error+" ese hee")
        }
    }

    const getLikedSongs = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/liked-songs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.log("Error fetching liked songs:", error);
            return [];
        }
    }
    const likedSongs = (songsData || [])
    .filter(song => song.visibility === 'public' && song.likedBy.includes(userID));
    return (
        <AuthContext.Provider value={{ token, setToken, userName, userID, handleLogout, handleLogin, songsData, appendSongs, addLike, addPlayCount, getLikedSongs,likedSongs }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
