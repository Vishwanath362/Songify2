import { useContext, useState, createContext, useEffect, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// ============================================================
// CONFIGURATION
// ============================================================

const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalDevelopment
    ? 'http://localhost:3000'
    : (import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'https://songify-v4q3.onrender.com');

// ============================================================
// UTILITIES
// ============================================================

const validateToken = (token) => {
    if (!token) return { valid: false, reason: 'no_token' };
    
    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        
        if (decoded.exp < now) {
            return { valid: false, reason: 'expired' };
        }
        
        if (!decoded.name || !decoded.id) {
            return { valid: false, reason: 'missing_data' };
        }
        
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, reason: 'invalid', error };
    }
};

const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// ============================================================
// CONTEXT
// ============================================================

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [userName, setUserName] = useState(null);
    const [userID, setUserID] = useState(null);
    const [songsData, setSongs] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchedSongs, setSearchedSongs] = useState(null);
    const [yourSongsData, setYourSongsData] = useState(null);

    // ============================================================
    // AUTH HANDLERS
    // ============================================================

    const handleLogout = useCallback(() => {
        setToken(null);
        setUserName(null);
        setUserID(null);
        setSongs([]);
        setYourSongsData(null);
        setSearchedSongs(null);
        localStorage.removeItem("token");
    }, []);

    const handleLogin = useCallback((newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }, []);

    // ============================================================
    // TOKEN VALIDATION
    // ============================================================

    useEffect(() => {
        if (!token) {
            setUserName(null);
            setUserID(null);
            return;
        }

        const validation = validateToken(token);
        
        if (!validation.valid) {
            console.warn(`Token ${validation.reason}, logging out`);
            handleLogout();
            return;
        }

        setUserName(validation.decoded.name);
        setUserID(validation.decoded.id);
    }, [token, handleLogout]);

    // ============================================================
    // DATA FETCHING
    // ============================================================

    const fetchPublicSongs = useCallback(async () => {
        if (!token) return;

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/getPublicSongs`,
                getAuthHeaders(token)
            );
            setSongs(response.data);
        } catch (err) {
            console.error("Error fetching public songs:", err);
            setSongs([]);
        }
    }, [token]);

    const fetchYourSongs = useCallback(async () => {
        if (!token) return;

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/getMySongs`,
                getAuthHeaders(token)
            );
            setYourSongsData(response.data);
        } catch (error) {
            console.error("Error fetching your songs:", error);
            setYourSongsData([]);
        }
    }, [token]);

    // Fetch songs when authenticated
    useEffect(() => {
        if (!token) return;
        
        fetchPublicSongs();
        fetchYourSongs();
    }, [token, fetchPublicSongs, fetchYourSongs]);

    // ============================================================
    // SONG ACTIONS
    // ============================================================

    const appendSongs = useCallback(async () => {
        await fetchPublicSongs();
    }, [fetchPublicSongs]);

    const updateYourSongs = useCallback(async () => {
        await fetchYourSongs();
    }, [fetchYourSongs]);
    const addLike = useCallback(async (songId) => {
        if (!token) {
            console.error("No token available - user not logged in");
            return { success: false, error: 'not_authenticated' };
        }

        const validation = validateToken(token);
        if (!validation.valid) {
            console.error("Token invalid, logging out");
            handleLogout();
            return { success: false, error: 'invalid_token' };
        }

        try {
            const response = await axios.patch(
                `${API_BASE_URL}/api/addLike`,
                { songId },
                getAuthHeaders(token)
            );
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Error toggling like:", error);
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleLogout();
            }
            
            return { success: false, error: error.response?.data?.message || 'like_failed' };
        }
    }, [token, handleLogout]);

    const addPlayCount = useCallback(async (songId) => {
        if (!token) return { success: false };

        try {
            await axios.patch(
                `${API_BASE_URL}/api/addPlayCount`,
                { songId },
                getAuthHeaders(token)
            );
            return { success: true };
        } catch (error) {
            console.error("Error incrementing play count:", error);
            return { success: false, error: error.message };
        }
    }, [token]);

    const getLikedSongs = useCallback(async () => {
        if (!token) return [];

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/likedSongs`,
                getAuthHeaders(token)
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching liked songs:", error);
            return [];
        }
    }, [token]);

    const handleSearch = useCallback(async (query) => {
        if (!token) {
            console.warn('Search requires authentication');
            return;
        }

        if (!query || query.trim() === "") {
            setSearchInput("");
            setSearchedSongs(null);
            return;
        }

        setSearchInput(query);

        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`,
                getAuthHeaders(token)
            );
            setSearchedSongs(response.data);
        } catch (error) {
            console.error("Search error:", error);
            setSearchedSongs([]);
        }
    }, [token]);

    // ============================================================
    // COMPUTED VALUES
    // ============================================================

    const likedSongs = useMemo(() => {
        if (!userID || !songsData) return [];
        return songsData.filter(
            song => song.visibility === 'public' && song.likedBy?.includes(userID)
        );
    }, [songsData, userID]);

    const isAuthenticated = useMemo(() => !!token && !!userID, [token, userID]);

    // ============================================================
    // CONTEXT VALUE
    // ============================================================

    const contextValue = useMemo(() => ({
        // Auth
        token,
        setToken,
        userName,
        userID,
        isAuthenticated,
        handleLogin,
        handleLogout,
        
        // Songs
        songsData,
        yourSongsData,
        likedSongs,
        appendSongs,
        updateYourSongs,
        
        // Actions
        addLike,
        addPlayCount,
        getLikedSongs,
        
        // Search
        searchInput,
        searchedSongs,
        handleSearch,
        
        // Config
        API_BASE_URL,
    }), [
        token,
        userName,
        userID,
        isAuthenticated,
        handleLogin,
        handleLogout,
        songsData,
        yourSongsData,
        likedSongs,
        appendSongs,
        updateYourSongs,
        addLike,
        addPlayCount,
        getLikedSongs,
        searchInput,
        searchedSongs,
        handleSearch,
    ]);
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================================
// CUSTOM HOOK
// ============================================================

export const useAuthContext = () => useContext(AuthContext);
