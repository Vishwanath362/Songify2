import UploadAudio from './components/uploadAudio.jsx'
import './App.css'
import Navbar from './components/navbar.jsx'
import Hero from './components/Hero.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/footer.jsx'
import AboutUs from './components/AboutUs.jsx'
import React from 'react'
import Signup from './authentication/Signup.jsx';
import Login from './authentication/Login.jsx';
import { AuthContextProvider } from './authentication/Auth.jsx';
import Dashboard from './components/Dashboard.jsx';
import Songs from './components/Songs.jsx';
import LikedSongs from './components/LikedSongs.jsx';
import YourUploads from './components/YourUploads.jsx';

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={
            <>
              <Navbar />
              <Hero />
              <AboutUs />
              <Footer />
            </>
          } />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />}></Route>
          <Route path='/about' element={<><Navbar /><AboutUs /></>}></Route>

       
          <Route path='/dashboard' element={<>
            <Navbar />
            <Dashboard />
            <Footer />
          </>}>
            
            <Route index element={<Songs />} /> 
            <Route path='likedSongs' element={<LikedSongs />} /> 
            <Route path='yourUploads' element={<YourUploads />} /> 
          </Route>
        </Routes>
      </AuthContextProvider>
    </Router>
  )
}
export default App
