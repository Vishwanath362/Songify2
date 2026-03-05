import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer'
import AboutUs from './components/AboutUs'
import React from 'react'
import Signup from './authentication/Signup';
import Login from './authentication/Login';
import { AuthContextProvider } from './authentication/Auth';
import Dashboard from './components/Dashboard';
import Songs from './components/Songs';
import LikedSongs from './components/LikedSongs';
import YourUploads from './components/YourUploads';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthContextProvider>
          <Routes>

            <Route path="/" element={
              <>
                <Navbar />
                <Hero />
                <AboutUs />
                <Footer />
              </>
            } />

            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/about' element={<><Navbar /><AboutUs /><Footer /></>} />

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
    </ErrorBoundary>
  )
}
export default App
