import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

function NavBar1() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkClass = (linkKey) => {
    const isActive = activeLink === linkKey;
    return `relative font-medium text-lg group transition-colors duration-300 ${
      isActive
        ? "text-blue-500"
        : isScrolled
        ? "text-[#f0f0f0]"
        : "text-black hover:text-blue-500"
    }`;
  };

  const getUnderlineClass = (linkKey) => {
    const isActive = activeLink === linkKey;
    return `after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] ${
      isActive
        ? "after:w-full after:bg-blue-500"
        : isScrolled
        ? "after:w-0 after:bg-white group-hover:after:w-full"
        : "after:w-0 after:bg-blue-500 group-hover:after:w-full"
    } after:transition-all after:duration-300`;
  };

  const userName = localStorage.getItem("userName");
  const isLoggedIn = !!localStorage.getItem("jwt");


  return (
    <div
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 h-[80px] ${
        isScrolled
          ? "shadow-md bg-[#00000099] text-white m-5 rounded-full top-2"
          : "bg-white text-black"
      }`}
    >
      <Link 
        to="/" 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setActiveLink("home")}
      >
        <img
          src="/navbarLogo.svg"
          alt="logo"
          className="w-12 h-12 sm:w-[73px] sm:h-[65px]"
        />
        <h1
          className={`font-bold text-2xl sm:text-[40px] text-[#336BFB] leading-[100%] ${
            isScrolled ? "text-white" : ""
          }`}
        >
          UniByte
        </h1>
      </Link>

      <div className="hidden md:flex items-center gap-20">
        <Link
          to="/"
          className={getLinkClass("home")}
          onClick={() => setActiveLink("home")}
        >
          <span className={getUnderlineClass("home")}>Home</span>
        </Link>

        <ScrollLink
          to="features"
          smooth={true}
          duration={500}
          className={`${getLinkClass("features")} cursor-pointer`}
          onClick={() => setActiveLink("features")}
        >
          <span className={getUnderlineClass("features")}>Features</span>
        </ScrollLink>

        <Link
          to="/support"
          d
          className={getLinkClass("support")}
          onClick={() => setActiveLink("support")}
        >
          <span className={getUnderlineClass("support")}>Support</span>
        </Link>
        {isLoggedIn && userName ? (
          <div
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg cursor-pointer"
            title={userName}
            onClick={() => navigate("/dashboard")}
          >
            {userName[0].toUpperCase()}
          </div>
        ) : (
        <Link
          to="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-lg"
        >
          Sign in
        </Link>
        )}
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
            className={getLinkClass("home")}
            onClick={() => {
              setActiveLink("home");
              setMenuOpen(false);
            }}
          >
            <span className={getUnderlineClass("home")}>Home</span>
          </Link>

          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            className={`${getLinkClass("features")} cursor-pointer`}
            onClick={() => {
              setActiveLink("features");
              setMenuOpen(false);
            }}
          >
            <span className={getUnderlineClass("features")}>Features</span>
          </ScrollLink>

          <Link
            to="/support"
            className={getLinkClass("support")}
            onClick={() => {
              setActiveLink("support");
              setMenuOpen(false);
            }}
          >
            <span className={getUnderlineClass("support")}>Support</span>
          </Link>

          <Link
            to="/login"
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
