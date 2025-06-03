import React from "react";
import { Link } from "react-router";

function Footer() {
  return (
    <div className="bg-[#666666] w-full px-10 py-10 flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        <div className="flex flex-col md:w-1/2 gap-5">
          <div className="flex items-center gap-3">
            <img
              src="/navbarLogo.svg"
              alt="logo"
              className="w-[60px] h-[70px] md:w-[75px] md:h-[88px]"
            />
            <h1 className="font-bold text-4xl md:text-[50px] text-white leading-none">
              ByteMe
            </h1>
          </div>

          <div className="text-white flex flex-col gap-1">
            <p className="font-bold text-xl md:text-2xl">Contact Us</p>
            <p className="text-sm md:text-base">+91XXXXXXXX</p>
            <p className="text-sm md:text-base">support@name.com</p>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-3 md:gap-5 text-white md:w-1/2">
          <Link className="font-bold text-base md:text-lg" to="#">
            Home
          </Link>
          <Link className="font-bold text-base md:text-lg" to="#">
            Login
          </Link>
          <Link className="font-bold text-base md:text-lg" to="#">
            Events
          </Link>
          <Link className="font-bold text-base md:text-lg" to="#">
            Marketplace
          </Link>
        </div>
      </div>

      <p className="text-white text-center mt-8 font-medium text-sm md:text-base max-w-[700px]">
        <em>
          Name is your campus's digital wallet and event hub: earn, spend, and
          explore with tokens built for student life.
        </em>
      </p>
    </div>
  );
}

export default Footer;
