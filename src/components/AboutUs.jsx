import React from 'react';
import { Music, Upload, Play, FolderOpen, TrendingUp, Users, Heart, Zap } from 'lucide-react';
import { useAuthContext } from '../authentication/Auth';
import { useNavigate } from 'react-router-dom';
const AboutUs = () => {
  const {token} =useAuthContext()
  const navigate = useNavigate();

  const handleStarted = ()=>{
    if(!token){
      navigate('/signup')
    }
    else{
      navigate('Dashboard');
    }
  }
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Your Music",
      description: "Share your tracks with the world or keep them private."
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Stream Instantly",
      description: "No wait, no buffering. Just hit play and vibe."
    },
    {
      icon: <FolderOpen className="w-8 h-8" />,
      title: "Create & Share Playlists",
      description: "Build your own music library, your way."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Get Discovered",
      description: "Go public and see your song trend in Popular Tracks."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-green-900 min-h-screen">
    
      <div className="relative overflow-hidden">
      
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent mb-6">
              About Us — Songify
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-400 mx-auto mb-8"></div>
            <p className="text-2xl md:text-3xl text-green-300 font-semibold mb-4">
              Your Sound, Your Stage.
            </p>
          </div>
        </div>
      </div>

     
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-20">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-green-500/20">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                At Songify, we believe music isn't just something you listen to — it's something you <span className="text-green-400 font-semibold">create</span>, <span className="text-green-400 font-semibold">feel</span>, and <span className="text-green-400 font-semibold">share</span>. That's why we built a platform where anyone can upload their own tracks, build playlists, and discover fresh sounds from rising creators around the world.
              </p>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mt-6">
                Whether you're an aspiring artist, a hobbyist producer, or just someone who loves music — Songify gives you the tools to express yourself and connect with a global audience.
              </p>
            </div>
          </div>

         
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
                <Zap className="w-12 h-12 text-green-400" />
                What You Can Do on Songify
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-400 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-green-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

         
          <div className="mb-20">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-green-500/30">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 flex items-center gap-4">
                <Heart className="w-12 h-12 text-green-400" />
                Built for Artists, by Developers
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-400 mb-8"></div>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-6">
                Songify was created by passionate developers and music lovers who wanted a cleaner, faster, and more personal alternative to massive streaming platforms. We focus on giving creators <span className="text-green-400 font-semibold">control</span>, <span className="text-green-400 font-semibold">visibility</span>, and <span className="text-green-400 font-semibold">freedom</span>.
              </p>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                This project is continuously evolving — and we're excited to grow it with feedback from people like you.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-green-500/20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 flex items-center justify-center gap-4">
                <Users className="w-12 h-12 text-green-400" />
                Join Us
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-400 mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                We're just getting started. If you're a creator, a listener, or someone with ideas — we'd love to have you along for the ride.
              </p>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Welcome to Songify.
                </h3>
                <p className="text-2xl md:text-3xl font-semibold text-green-300">
                  Let the world hear you.
                </p>
              </div>
              
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleStarted} className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-xl font-bold text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50">
                  Get Started Today
                </button>
                <button className="px-8 py-4 border-2 border-green-500 rounded-2xl text-xl font-bold text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default AboutUs;