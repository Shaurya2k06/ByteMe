import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, ChevronDown, Home, RefreshCw, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "./ConnectButton";

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

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const handleSwitch = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  let navLinks
  if(localStorage.getItem("role") === "user") {
    navLinks = [
      { name: "Dashboard", href: "/studentDashboard" },
      { name: "Shop", href: "/shop" },
      { name: "Events", href: "/events" },
    ];
  } else {
    navLinks = [
      {name: "Dashboard", href: "/dashboard"},
      {name: "Shop", href: "/shop"},
      {name: "Events", href: "/events"},
    ];
  }

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
            
            <div className="hidden sm:block">
              <motion.h1
                className="text-2xl font-bold tracking-tight"
              >
                <span className="text-gray-800">UniByte</span>
              </motion.h1>
              <motion.p 
                className="text-xs text-gray-500 font-medium tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                
              </motion.p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 group px-3 py-2 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{link.name}</span>
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Glowing background effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>

            {/* Connect Button - Smaller Size */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="scale-75 origin-center"
            >
              <ConnectButton />
            </motion.div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.div
                className="flex items-center space-x-3 cursor-pointer bg-gray-50/80 backdrop-blur-md rounded-2xl p-3 pr-4 border border-gray-200/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300 group"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {username ? username[0].toUpperCase() : "U"}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                </div>
                
                <div className="flex flex-col text-right">
                  <span className="font-semibold text-sm text-gray-800">
                    {username || "User"}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{usertype}</span>
                </div>
                
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                </motion.div>
              </motion.div>

              {/* Desktop Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                    className="absolute top-full right-0 mt-4 w-64 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5">
                      <div className="flex items-center space-x-4">
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

                {/* Mobile Connect Button - Keep normal size for mobile */}
                <div className="px-2">
                  <ConnectButton />
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-3">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 group"
                      onClick={() => setMenuOpen(false)}
                      whileHover={{ 
                        x: 8, 
                        scale: 1.02,
                        backgroundColor: "rgba(59, 130, 246, 0.1)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                      </div>
                      <span className="font-medium">{link.name}</span>
                    </motion.a>
                  ))}

                  <motion.button
                    className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 group"
                    onClick={() => {
                      navigate("/");
                      setMenuOpen(false);
                    }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <Home className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Home</span>
                  </motion.button>

                  <motion.button
                    className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200 group"
                    onClick={() => {
                      handleSwitch();
                      setMenuOpen(false);
                    }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-purple-100 transition-colors">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Switch Account</span>
                  </motion.button>

                  <motion.button
                    className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all duration-200 group"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-red-100 transition-colors">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Logout</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default NavBar3;