import { Music, Search, Menu as MenuIcon, X as XIcon } from "lucide-react";
import React, { useState } from "react";
import { useAuthContext } from "../authentication/Auth";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [clickedInput, setInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { token, userName, handleLogout } = useAuthContext();
  const userLogo = userName ? userName[0] : "";

  // navLinks for mapping
  const navLinks = [
    { name: "Music", to: "/Dashboard" },
    { name: "Your Uploads", to: "/Dashboard/yourUploads" },
  ];

  const actionLinks = [
    { name: "Browse", to: "/Dashboard" },
    { name: "About Us", to: "/about" },
  ];

  return (
    <header className="w-full bg-white shadow z-20">
      <nav className="container mx-auto flex items-center justify-between py-2 px-3 md:px-6 h-16 md:h-20">
        {/* Left logo/brand for mobile and desktop */}
        <div className="flex items-center gap-2">
          <Music size={32} />
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-black">
            Songify
          </Link>
        </div>

        {/* Desktop Nav links */}
        <ul className="hidden md:flex items-center gap-6 text-base font-semibold ml-10">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.to} className="px-2 py-1 text-gray-700 hover:text-black transition">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search (hidden on mobile, visible md+) */}
        <div
          className={`hidden md:flex items-center h-12 p-1 bg-gray-500 w-[320px] lg:w-[420px] rounded-full border-2 transition ${
            clickedInput ? "border-4 border-black" : "border-transparent"
          }`}
        >
          <div className="pl-2">
            <Search color="white" />
          </div>
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="placeholder-gray-400 border-none outline-none text-base bg-transparent w-full pl-3"
            onFocus={() => setInput(true)}
            onBlur={() => setInput(false)}
          />
        </div>

        {/* Desktop right actions */}
        <ul className="hidden md:flex items-center gap-6 font-semibold ml-6">
          {actionLinks.map(link => (
            <li key={link.name}>
              <Link to={link.to} className="text-gray-700 px-2 py-1 hover:text-black transition">
                {link.name}
              </Link>
            </li>
          ))}
          {token ? (
            <>
              <li className="bg-gray-200 flex items-center rounded-xl h-12 px-2">
                <div className="flex items-center justify-center rounded-full bg-green-600 w-9 h-9 mr-2 text-md uppercase text-white">
                  {userLogo}
                </div>
                <span className="uppercase font-bold pr-2 text-black">
                  {userName}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white h-10 w-20 rounded-full cursor-pointer bg-red-400 hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup">
                  <button className="text-gray-700 px-3 py-1 hover:text-black transition">
                    Sign Up
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <button className="bg-white border border-gray-400 h-10 w-20 rounded-full hover:bg-gray-100 transition">
                    Login
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>

      
        <button
          className="inline-flex md:hidden items-center p-2 focus:outline-none"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <XIcon size={28} /> : <MenuIcon size={28} />}
        </button>
      </nav>
      
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 z-30 absolute left-0 top-16 w-full">
          <ul className="flex flex-col gap-3">
            {navLinks.map(link => (
              <li key={link.name}>
                <Link
                  to={link.to}
                  className="text-lg text-gray-700 block py-2 px-2 rounded hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
           
            <li className="my-2">
              <div
                className={`flex items-center h-11 bg-gray-500 rounded-full border-2 ${
                  clickedInput ? "border-black border-4" : "border-transparent"
                }`}
              >
                <div className="pl-2">
                  <Search color="white" size={20} />
                </div>
                <input
                  type="text"
                  placeholder="What do you want to listen to?"
                  className="placeholder-gray-300 border-none outline-none text-base bg-transparent w-full px-2"
                  onFocus={() => setInput(true)}
                  onBlur={() => setInput(false)}
                />
              </div>
            </li>
            {actionLinks.map(link => (
              <li key={link.name}>
                <Link
                  to={link.to}
                  className="text-lg text-gray-700 block py-2 px-2 rounded hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {token ? (
              <>
                <li>
                  <div className="flex items-center gap-3 bg-gray-200 rounded-xl px-3 py-2 mt-2">
                    <span className="rounded-full flex items-center justify-center bg-blue-400 w-8 h-8 text-md uppercase text-white">
                      {userLogo}
                    </span>
                    <span className="uppercase font-bold text-black">{userName}</span>
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => {handleLogout(); setMenuOpen(false);}}
                    className="w-full h-10 rounded-full bg-red-400 text-white mt-2 hover:bg-red-500 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}>
                    <button className="w-full text-gray-700 py-2 hover:text-black transition">
                      Sign Up
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full bg-white border border-gray-400 h-10 rounded-full hover:bg-gray-100 transition">
                      Login
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
