import React from "react";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-[#1a1a1a] w-full px-6 md:px-16 py-10 flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex flex-col md:w-1/2 gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/navbarLogo.svg"
              alt="logo"
              className="w-[60px] h-[70px] md:w-[75px] md:h-[88px]"
            />
            <h1 className="text-white text-4xl md:text-[48px] font-bold leading-tight">
              ByteMe
            </h1>
          </div>
          <div className="text-white flex flex-col gap-1">
            <p className="text-xl font-semibold">Contact Us</p>
            <p className="text-base opacity-80">+91XXXXXXXXXX</p>
            <p className="text-base opacity-80">support@byteme.com</p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end text-white gap-3 md:gap-4 md:w-1/2">
          <Link
            to="/"
            className="text-lg font-medium hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-lg font-medium hover:text-blue-400 transition-colors"
          >
            Login
          </Link>
          <Link
            to="#"
            className="text-lg font-medium hover:text-blue-400 transition-colors"
          >
            Events
          </Link>
          <Link
            to="#"
            className="text-lg font-medium hover:text-blue-400 transition-colors"
          >
            Marketplace
          </Link>
        </div>
      </div>

      <p className="text-white text-center mt-10 text-sm md:text-base max-w-[700px] opacity-80">
        <em>
          ByteMe is your campus's digital wallet and event hub — earn, spend,
          and explore with tokens built for student life.
        </em>
      </p>
    </footer>
  );
}

export default Footer;
