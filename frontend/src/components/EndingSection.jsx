import React from "react";
import { motion } from "framer-motion";

function EndingCard() {
  const shadowColor = "#06B6D4";
  const baseShadow = `0 4px 6px -1px ${shadowColor}80`;
  const hoverShadow = `0 6px 12px -2px ${shadowColor}99`;

  return (
    <div
      className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] h-[400px] sm:h-[450px] rounded-3xl flex flex-col justify-center items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white/90 backdrop-blur-sm animate-rotate-shadow transition-all duration-300 hover:scale-105"
      style={{ "--shadow-color": `${shadowColor}80`, "--shadow": baseShadow }}
      onMouseEnter={(e) => {
        e.currentTarget.style.animationPlayState = "paused";
        e.currentTarget.style.boxShadow = hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.animationPlayState = "running";
        e.currentTarget.style.boxShadow = "var(--shadow)";
      }}
    >
      <img
        src="/scholarhat.svg"
        alt="AutoPay Icon"
        className="w-full h-auto max-w-[150px] sm:max-w-[200px] object-contain"
      />
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">
        AutoPay for Fees
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-center px-2">
        <em>
          Never miss a deadline again — enable AutoPay for tuition, hostel, or
          exam fees using smart contracts.
        </em>
      </p>
    </div>
  );
}

function EndingSection() {
  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-20 -right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-tr from-blue-500/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-r from-cyan-300/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Dot Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, rgba(6, 182, 212, 0.1) 2px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 left-10 w-3 h-3 sm:w-4 sm:h-4 bg-cyan-400 rounded-full opacity-50"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full opacity-40"
          animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="mt-10 text-center w-full z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          Why <span className="text-blue-600">UniByte</span>
        </h1>
      </div>
      <div className="flex items-center justify-center mt-10 flex-1">
        <EndingCard />
      </div>
    </div>
  );
}

export default EndingSection;
