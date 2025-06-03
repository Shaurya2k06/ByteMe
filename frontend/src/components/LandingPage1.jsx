import React from "react";
import NavBar1 from "./NavBar1";
import { TypewriterEffectDemo } from "./typewriterEffect";
import { Link } from "react-router";
import { DotBackgroundDemo } from "./ui/DotBackgroundDemo";
import { ConnectButton } from "./ConnectButton";
import { motion } from "framer-motion";

function LandingPage1() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white overflow-hidden">
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-between px-6 py-10 gap-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left gap-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-full">
            <TypewriterEffectDemo />
          </div>

          <p className="font-normal text-lg sm:text-xl text-[#666666] leading-relaxed max-w-[500px]">
            Ditch the cash, skip the queues, and forget about the paperwork —
            all using crypto on one seamless platform.
          </p>

          <motion.div
            className="w-[70%] sm:w-[50%] lg:w-[40%]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ConnectButton />
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <motion.img
            src="/HeroImage.svg"
            alt="Hero"
            className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[626px] lg:h-[626px] object-contain"
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LandingPage1;
