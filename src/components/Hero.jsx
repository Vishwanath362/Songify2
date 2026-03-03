import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { MoveRight, Play, Music, Headphones } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../authentication/Auth";

const Hero = () => {
    const navigate = useNavigate();
    const { token, setToken, userName, handleLogout } = useAuthContext();

    // Refs for GSAP animations
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonsRef = useRef(null);
    const statsRef = useRef(null);
    const musicBarsRef = useRef([]);
    const headphonesRef = useRef(null);
    const musicNotesRef = useRef([]);

    const handleLogin = () => {
        // console.log("clicked");
        {!token && navigate("/signup")}
        {token && navigate("/dashboard")}
    };

    const musicImages = [
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1459305272254-33a7d593a851?w=200&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=400&fit=crop"
    ];

    const heights = ['h-20 sm:h-24 md:h-28 lg:h-32', 'h-40 sm:h-48 md:h-56 lg:h-62', 'h-60 sm:h-72 md:h-84 lg:h-102', 'h-48 sm:h-56 md:h-60 lg:h-64', 'h-16 sm:h-20 md:h-24 lg:h-30', 'h-32 sm:h-40 md:h-48 lg:h-56', 'h-52 sm:h-64 md:h-72 lg:h-80', 'h-28 sm:h-36 md:h-40 lg:h-48'];

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Set initial states
        gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current, statsRef.current], {
            opacity: 0,
            y: 50
        });

        gsap.set(musicBarsRef.current, {
            opacity: 0,
            scale: 0.5,
            y: 100
        });

        gsap.set(headphonesRef.current, {
            opacity: 0,
            scale: 0,
            rotation: -180
        });

        // Main entrance animation
        tl
            .to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "back.out(1.7)"
            })
            .to(subtitleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, "-=0.6")
            .to(buttonsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, "-=0.4")
            .to(statsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, "-=0.3")
            .to(musicBarsRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                stagger: {
                    each: 0.15,
                    from: "center"
                }
            }, "-=0.8")
            .to(headphonesRef.current, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: "back.out(2)"
            }, "-=0.4");

        // Continuous music visualization animation
        const musicVisualizationTl = gsap.timeline({ repeat: -1 });
        // musicVisualizationTl.to(musicBarsRef.current, {
        //     scaleY: () => gsap.utils.random(0.8, 1.4),
        //     duration: 0.6,
        //     ease: "power2.inOut",
        //     stagger: {
        //         each: 0.1,
        //         from: "random",
        //         repeat: -1,
        //         repeatRefresh: true
        //     }
        // });

        // Floating animation for music bars
        gsap.to(musicBarsRef.current, {
            y: -10,
            duration: 2.5,
            ease: "power1.inOut",
            stagger: {
                each: 0.3,
                repeat: -1,
                yoyo: true
            }
        });

        // Headphones floating animation
        gsap.to(headphonesRef.current, {
            y: -15,
            rotation: 3,
            duration: 3,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true
        });

        // Pulsing glow effect for music bars
        gsap.to(musicBarsRef.current, {
            boxShadow: "0 10px 30px rgba(34, 197, 94, 0.5)",
            duration: 2,
            ease: "power2.inOut",
            stagger: {
                each: 0.2,
                repeat: -1,
                yoyo: true
            }
        });

        // Animated music notes
        const createFloatingNote = () => {
            const note = document.createElement('div');
            note.innerHTML = ['♪', '♫', '♬'][Math.floor(Math.random() * 3)];
            note.className = 'absolute text-green-400 text-2xl opacity-60 pointer-events-none z-0';
            note.style.left = Math.random() * 100 + '%';
            note.style.top = Math.random() * 100 + '%';

            heroRef.current.appendChild(note);

            gsap.fromTo(note,
                {
                    opacity: 0,
                    scale: 0.5,
                    y: 50
                },
                {
                    opacity: 0.6,
                    scale: 1,
                    y: -100,
                    x: gsap.utils.random(-50, 50),
                    rotation: gsap.utils.random(-360, 360),
                    duration: 4,
                    ease: "power1.out",
                    onComplete: () => note.remove()
                }
            );
        };

        // Create floating notes periodically
        const noteInterval = setInterval(createFloatingNote, 2000);

        // Button hover animations
        const setupButtonHover = (button, scale = 1.05) => {
            if (!button) return;

            const hoverTl = gsap.timeline({ paused: true });
            hoverTl
                .to(button, {
                    scale: scale,
                    duration: 0.3,
                    ease: "power2.out"
                })
                .to(button, {
                    boxShadow: "0 15px 35px rgba(34, 197, 94, 0.4)",
                    duration: 0.2
                }, "-=0.3");

            button.addEventListener('mouseenter', () => hoverTl.play());
            button.addEventListener('mouseleave', () => hoverTl.reverse());
        };

        // Setup button hovers
        const buttons = buttonsRef.current?.querySelectorAll('button');
        buttons?.forEach(button => setupButtonHover(button));

        // Music bar hover effects
        musicBarsRef.current.forEach((bar, index) => {
            if (bar) {
                const barHoverTl = gsap.timeline({ paused: true });
                barHoverTl
                    .to(bar, {
                        scale: 1.2,
                        rotationY: 15,
                        boxShadow: "0 20px 40px rgba(34, 197, 94, 0.6)",
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    .to(bar, {
                        scaleY: 1.4,
                        duration: 0.2,
                        ease: "power2.inOut"
                    }, "-=0.1");

                bar.addEventListener('mouseenter', () => barHoverTl.play());
                bar.addEventListener('mouseleave', () => barHoverTl.reverse());
            }
        });

        // Cleanup
        return () => {
            clearInterval(noteInterval);
            tl.kill();
            musicVisualizationTl.kill();
            gsap.killTweensOf([
                titleRef.current,
                subtitleRef.current,
                buttonsRef.current,
                statsRef.current,
                musicBarsRef.current,
                headphonesRef.current
            ]);
        };
    }, []);

    // Audio reactive animation trigger
    const triggerAudioReactive = () => {
        gsap.to(musicBarsRef.current, {
            scaleY: () => gsap.utils.random(0.2, 2),
            duration: 0.1,
            ease: "none",
            stagger: {
                each: 0.02,
                repeat: 20,
                repeatRefresh: false
            }
        });
    };

    return (
        <div ref={heroRef} className="bg-gradient-to-br from-gray-950 via-gray-900 to-green-900 min-h-screen flex flex-col relative overflow-hidden">
            {/* Container */}
            <div className=" pb-30 sm:pb-0 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">

                {/* Left Content */}
                <div className="flex-1 max-w-full lg:max-w-2xl z-20 text-center lg:text-left">
                    <div className="mb-6 sm:mb-8">
                        <div ref={titleRef} className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                            <Music className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                            <span className="text-green-400 font-semibold text-base sm:text-lg">SONGIFY</span>
                        </div>

                        <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent leading-tight">
                            Your Personal Music Stage
                        </h1>

                        <p ref={subtitleRef} className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-full lg:max-w-lg mx-auto lg:mx-0">
                            Upload tracks, build playlists, and explore what others are creating — all in one powerful, free platform made for creators.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 w-full sm:w-auto justify-center lg:justify-start">
                        <button
                            onClick={handleLogin}
                            className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-full text-base sm:text-lg font-semibold text-white shadow-lg transition-all duration-300 transform-gpu w-full sm:w-auto cursor-pointer"
                        >
                            Get Started Free
                            <MoveRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <Link to="https://www.linkedin.com/posts/vishwanath-singh-7bb593298_just-launched-songify-a-place-to-share-activity-7356014255235633152-Q7pI?utm_source=share&utm_medium=member_ios&rcm=ACoAAEf9Lb8B3SG2V3qkyKatjFafVMtaCP37mWI">
                            <button
                                // onClick={triggerAudioReactive}
                                className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 border-2 border-green-500 rounded-full text-base sm:text-lg font-semibold text-green-400 hover:bg-green-500/10 transition-all duration-300 transform-gpu w-full sm:w-auto cursor-pointer"
                            >
                                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                                Watch Demo
                            </button></Link>
                    </div>

                    {/* Stats */}
                    <div ref={statsRef} className="flex justify-center lg:justify-start gap-6 sm:gap-8 text-sm text-gray-400">
                        <div className="text-center lg:text-left">
                            <div className="text-xl sm:text-2xl font-bold text-green-400">10K+</div>
                            <div className="text-xs sm:text-sm">Creators</div>
                        </div>
                        <div className="text-center lg:text-left">
                            <div className="text-xl sm:text-2xl font-bold text-green-400">50K+</div>
                            <div className="text-xs sm:text-sm">Tracks</div>
                        </div>
                        <div className="text-center lg:text-left">
                            <div className="text-xl sm:text-2xl font-bold text-green-400">1M+</div>
                            <div className="text-xs sm:text-sm">Plays</div>
                        </div>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="flex-1 flex justify-center items-center relative mt-8 lg:mt-0 w-full">
                    <div className="flex  items-center justify-center gap-1 sm:gap-2 lg:gap-3 w-full max-w-md lg:max-w-none">
                        {musicImages.map((image, index) => (
                            <div
                                key={index}
                                ref={el => musicBarsRef.current[index] = el}
                                className={`${heights[index]} w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 rounded-t-full rounded-b-full bg-cover bg-center shadow-xl cursor-pointer transform-gpu`}
                                style={{
                                    backgroundImage: `url('${image}')`,
                                    transformOrigin: 'bottom center'
                                }}
                                onClick={() => {
                                    gsap.to(musicBarsRef.current[index], {
                                        scale: 0.8,
                                        duration: 0.1,
                                        yoyo: true,
                                        repeat: 1,
                                        ease: "power2.inOut"
                                    });
                                }}
                            />
                        ))}
                    </div>

                    {/* Floating Headphones */}
                    <div ref={headphonesRef} className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-green-500 p-2 sm:p-3 lg:p-4 rounded-full shadow-lg transform-gpu">
                        <Headphones className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-16 lg:h-20">
                    <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="url(#gradient)" fillOpacity="0.1" />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export default Hero;
