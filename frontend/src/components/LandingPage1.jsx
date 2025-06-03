import React from "react";
import NavBar1 from "./NavBar1";
import { TypewriterEffectDemo } from "./typewriterEffect";
import { Link } from "react-router";

function LandingPage1() {
  return (
    <div className="flex w-full min-h-screen flex-col jusftify-center">
      <NavBar1 />
      <div className="flex-1 flex-col">
        <div className="flex flex-1  ">
          <div className="w-[60%] flex flex-col p-7">
            <div className=" mt-20">
              <TypewriterEffectDemo />
            </div>

            <p className="font-[400] text-[20px] leading-[35px] text-[#666666] ">
              Ditch the cash, skip the queues, and forget about the paperwork —
              all using crypto on one seamless platform.
            </p>
            <Link
              tp="#"
              className="bg-blue-500 w-[40%] mt-4 text-center font-[500] text-[30px] leading-[35px] text-white p-5 rounded-md"
            >
              Connect Wallet
            </Link>
          </div>
          <div className="w-1/2 object-fit">
            <img
              src="../public/HeroImage.svg"
              className="w-[626px] h-[626px]"
              alt="Hero image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage1;
