import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

function NavBar1() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        isScrolled
          ? "shadow-md bg-[#00000099] text-white"
          : "bg-white text-black"
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src="/navbarLogo.svg"
          alt="logo"
          className="w-12 h-12 sm:w-[73px] sm:h-[65px]"
        />
        <h1 className="font-bold text-2xl sm:text-[40px] text-[#336BFB] leading-[100%]">
          ByteMe
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="font-medium text-lg hover:text-blue-500">
          Home
        </Link>

        <ScrollLink
          to="features"
          smooth={true}
          duration={500}
          className="font-medium text-lg hover:text-blue-500 cursor-pointer"
        >
          Features
        </ScrollLink>

        <Link to="/support" className="font-medium text-lg hover:text-blue-500">
          Support
        </Link>
        <Link
          to="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-lg"
        >
          Sign in
        </Link>
      </div>

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

      {menuOpen && (
        <div className="absolute top-[80px] right-4 w-[90%] bg-white text-black shadow-md rounded-xl p-5 flex flex-col gap-4 md:hidden z-50">
          <Link
            to="/"
            className="text-lg font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            className="font-medium text-lg hover:text-blue-500 cursor-pointer"
          >
            Features
          </ScrollLink>

          <Link
            to="/"
            className="text-lg font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Support
          </Link>
          <Link
            to="/"
            className="bg-blue-500 text-white text-center py-2 rounded-md font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavBar1;
