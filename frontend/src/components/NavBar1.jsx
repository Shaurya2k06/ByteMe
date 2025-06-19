import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X, User } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

function NavBar1() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userName = localStorage.getItem("userName");
  const isLoggedIn = !!localStorage.getItem("jwt");

  const navItems = [
    { key: "home", label: "Home", to: "/", type: "link" },
    { key: "features", label: "Features", to: "features", type: "scroll" },
    { key: "about", label: "About", to: "/about", type: "link" },
  ];

  return (
    <>
      {/* Backdrop blur for mobile menu */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "py-3 px-6"
            : "py-6 px-6"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-500 ease-out ${
            isScrolled
              ? "bg-white/80 backdrop-blur-xl shadow-lg border border-gray-200/20 rounded-2xl px-6 py-3"
              : "bg-transparent px-0 py-0"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
              onClick={() => setActiveLink("home")}
            >
              <div className="relative">
                <img
                  src="/navbarLogo.svg"
                  alt="logo"
                  className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12"
                />
              </div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UniByte
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                item.type === "scroll" ? (
                  <ScrollLink
                    key={item.key}
                    to={item.to}
                    smooth={true}
                    duration={500}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-all duration-300 ${
                      activeLink === item.key
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveLink(item.key)}
                  >
                    {item.label}
                    {activeLink === item.key && (
                      <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse -z-10" />
                    )}
                  </ScrollLink>
                ) : (
                  <Link
                    key={item.key}
                    to={item.to}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      activeLink === item.key
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveLink(item.key)}
                  >
                    {item.label}
                    {activeLink === item.key && (
                      <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse -z-10" />
                    )}
                  </Link>
                )
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn && userName ? (
                <div
                  className="group relative"
                  onClick={() => {
                    const role = localStorage.getItem("role");
                    if (role === "user") {
                      navigate("/studentDashboard");
                    } else {
                      navigate("/dashboard");
                    }
                    setMenuOpen(false);
                  }}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg">
                    {userName[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {userName}
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-full transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  <span className="relative z-10">Sign in</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-100" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full transition-all duration-300 hover:bg-gray-100 active:scale-95"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="relative w-6 h-6">
                <Menu
                  size={24}
                  className={`absolute transition-all duration-300 ${
                    menuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
                <X
                  size={24}
                  className={`absolute transition-all duration-300 ${
                    menuOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-6 right-6 mt-2 transition-all duration-500 ease-out origin-top ${
            menuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/20 p-6 space-y-1">
            {navItems.map((item, index) => (
              item.type === "scroll" ? (
                <ScrollLink
                  key={item.key}
                  to={item.to}
                  smooth={true}
                  duration={500}
                  className={`block px-4 py-3 text-gray-700 font-medium rounded-xl cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 ${
                    activeLink === item.key ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    setActiveLink(item.key);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </ScrollLink>
              ) : (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`block px-4 py-3 text-gray-700 font-medium rounded-xl transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 ${
                    activeLink === item.key ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    setActiveLink(item.key);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              )
            ))}
            
            <div className="pt-3 border-t border-gray-200/50">
              {isLoggedIn && userName ? (
                <div
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 font-medium rounded-xl cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {userName[0].toUpperCase()}
                  </div>
                  Dashboard
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center font-medium rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar1;