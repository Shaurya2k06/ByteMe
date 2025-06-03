import React, { useState, useEffect } from "react";
import { Link } from "react-router";

function NavBar1() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return (
    <div
      className={`sticky top-0 z-50 flex  justify-between p-5 transition-all h-[79px] duration-300 ${
        isScrolled
          ? "shadow-md bg-[#00000099] rounded-md text-white"
          : "bg-white"
      }`}
    >
      <div className="flex items-center">
        <img
          className="w-[73px] h-[65px] "
          src="../public/navbarLogo.svg"
          alt="logo"
        />
        <h1 className="inline-block font-[700] text-[64px] leading-[100%] text-[#336BFB]">
          ByteMe
        </h1>
      </div>
      <div className=" flex   mr-2 items-center justify-center gap-10">
        <Link to="/" className="font-[500] text-[20px] leading-[100%] ">
          Home
        </Link>
        <Link to="/" className="font-[500] text-[20px] leading-[100%] ">
          Features
        </Link>
        <Link to="/" className="font-[500] text-[20px] leading-[100%] ">
          Support
        </Link>
        <Link
          to="/"
          className="font-[500]  bg-blue-500 text-white rounded-[15px] text-[20px] p-2 leading-[100%] "
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default NavBar1;
