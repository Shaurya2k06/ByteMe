import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";

function NavBar2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userName = localStorage.getItem("userName");
  const userType = localStorage.getItem("role").toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  return (
    <div
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 h-[80px] ${
        isScrolled
          ? "shadow-md bg-[#00000099] m-5 rounded-full top-2 text-white"
          : "bg-white text-black"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/navbarLogo.svg"
          alt="logo"
          className="w-12 h-12 sm:w-[73px] sm:h-[65px]"
        />
        <h1
          className={`font-bold text-2xl sm:text-[40px] leading-[100%] text-[#336BFB] ${
            isScrolled ? "text-white" : ""
          }`}
        >
          UniByte
        </h1>
      </div>

      {/* Desktop Dropdown */}
      <div
        className="hidden md:flex items-center gap-3 relative"
        ref={dropdownRef}
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <div className="flex flex-col text-right">
            <span className={`font-medium text-sm ${textColor}`}>{userName}</span>
            <span className={`text-xs ${subTextColor}`}>{userType}</span>
          </div>
          <User className={`${iconColor}`} size={28} />
          <ChevronDown className={`${iconColor}`} size={20} />
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
          <a href="/" className="block px-4 py-2 hover:bg-gray-100 text-sm">
            Home
          </a>
          <a
            href="/switch-account"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Switch Account
          </a>
          <a
            href="/logout"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Logout
          </a>
        </div>
      </div>

      {/* Hamburger for Mobile */}
      <div className="md:hidden ml-auto">
        {menuOpen ? (
          <X
            size={30}
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer"
          />
        ) : (
          <Menu
            size={30}
            onClick={() => setMenuOpen(true)}
            className="cursor-pointer"
          />
        )}
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-[80px] right-4 w-[90%] bg-white text-black shadow-md rounded-xl p-5 flex flex-col gap-4 md:hidden z-50">
          {/* Profile */}
          <div className="flex items-center gap-3">
            <User className="text-gray-700" size={28} />
            <div className="flex flex-col">
              <span className="text-gray-700 font-medium text-sm">
                {userName}
              </span>
              <span className="text-gray-500 text-xs">{userType}</span>
            </div>
          </div>

          <a href="/" className="block px-4 py-2 hover:underline text-sm">
            Home
          </a>
          <a
            href="/switch-account"
            className="block px-4 py-2 hover:underline text-sm"
          >
            Switch Account
          </a>
          <a href="/logout" className="block px-4 py-2 hover:underline text-sm">
            Logout
          </a>
        </div>
      )}
    </div>
  );
}

export default NavBar2;
