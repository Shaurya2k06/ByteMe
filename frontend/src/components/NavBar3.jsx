import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, ChevronDown, Home, RefreshCw, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function NavBar3() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const username = localStorage.getItem("userName");
  const usertype = localStorage.getItem("role")?.toUpperCase() || "GUEST";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const textColor = isScrolled ? "text-white" : "text-gray-700";
  const subTextColor = isScrolled ? "text-gray-300" : "text-gray-500";
  const iconColor = isScrolled ? "text-white" : "text-gray-700";
  const hoverBg = isScrolled ? "hover:bg-[#333]" : "hover:bg-gray-100";

  // Underline animation classes for links
  // Using tailwind with before pseudo-element won't work directly, so we add custom CSS below

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-gray-200/50 mx-4 mt-2 rounded-2xl" 
          : "bg-white/80 backdrop-blur-sm mt-2"
      }`}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-8, 8, -8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-4 group cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <motion.img
                src="/navbarLogo.svg"
                alt="UniByte Logo"
                className="w-12 h-12 object-contain shadow-lg rounded-2xl"
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              
              {/* Glowing effect */}
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <div
              className={`absolute top-[60px] right-0 ${
                isScrolled ? "bg-[#222] text-white" : "bg-white text-black"
              } shadow-lg border rounded-lg w-44 z-50 overflow-hidden transition-all duration-300 transform ${
                dropdownOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <a
                href="/"
                className={`block px-4 py-2 ${hoverBg} text-sm underline-animated`}
              >
                Home
              </a>
              <a
                href="/switch-account"
                className={`block px-4 py-2 ${hoverBg} text-sm underline-animated`}
              >
                Switch Account
              </a>
              <a
                href="/logout"
                className={`block px-4 py-2 ${hoverBg} text-sm underline-animated`}
              >
                Logout
              </a>
            </div>
          </div>
        </div>

                    {/* Menu Items */}
                    <div className="p-3 space-y-2">
                      <motion.button
                        className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 group"
                        onClick={() => {
                          navigate("/");
                          setDropdownOpen(false);
                        }}
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                          <Home className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">Home</span>
                      </motion.button>

                      <motion.button
                        className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 group"
                        onClick={() => {
                          handleSwitch();
                          setDropdownOpen(false);
                        }}
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-purple-100 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">Switch Account</span>
                      </motion.button>

                      <motion.button
                        className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all duration-200 group"
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-red-100 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-5 h-5">
              <motion.div
                animate={{ rotate: menuOpen ? 45 : 0, opacity: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Menu className="w-5 h-5" />
              </motion.div>
              <motion.div
                animate={{ rotate: menuOpen ? 0 : -45, opacity: menuOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <X className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="md:hidden bg-white/95 backdrop-blur-2xl rounded-3xl mt-4 mx-4 mb-6 shadow-2xl border border-gray-200/50 overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* Mobile Profile Section */}
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {username ? username[0].toUpperCase() : "U"}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{username || "User"}</h3>
                    <p className="text-xs text-gray-600">{usertype}</p>
                  </div>
                </div>

            {/* Mobile Links */}
            <a
              href="/dashboard"
              className="block text-sm font-medium underline-animated"
            >
              Dashboard
            </a>
            <a
              href="/shop"
              className="block text-sm font-medium underline-animated"
            >
              Shop
            </a>
            <a
              href="/events"
              className="block text-sm font-medium underline-animated"
            >
              Events
            </a>
            <a href="/" className="block text-sm underline-animated">
              Home
            </a>
            <a
              href="/switch-account"
              className="block text-sm underline-animated"
            >
              Switch Account
            </a>
            <a href="/logout" className="block text-sm underline-animated">
              Logout
            </a>
          </div>
        )}
      </div>
    </motion.header>
  );
}

export default NavBar3;