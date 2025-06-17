import NavBar1 from "./components/NavBar1";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OfferCard from "./components/OfferCard";
import EndingSection from "./components/EndingSection";

function About() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const pageTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Simulate content loading (for OfferCards)
    const contentTimer = setTimeout(() => {
      setIsContentLoading(false);
    }, 1000);

    return () => {
      clearTimeout(pageTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const offers = [
    {
      icon: "/cashAbout.svg",
      title: "Pay Fees & Much More",
      description:
        "Manage all your campus payments through one seamless platform. From tuition and exam fees to library fines and hostel charges — make secure, trackable payments using blockchain-backed tokens. With smart contract automation, enjoy hassle-free transactions and even enable AutoPay for recurring dues.",
      color: "cyan",
    },
    {
      icon: "/paperclip.svg",
      title: "Peer to Peer Transfers",
      description:
        "Transferring money to classmates has never been easier. Send tokens instantly to peers for notes, group contributions, or shared expenses — no bank links, no delays. With zero processing charges and real-time confirmation, peer transfers become frictionless and fun.",
      color: "8C52FF",
    },
    {
      icon: "/bag.svg",
      title: "Exciting Offers on 100+ Items",
      description:
        "Use your UniByte tokens to unlock student-exclusive discounts on a wide range of items like snacks, coffee, stationery, tech accessories, and more. Campus vendors and partner brands offer special deals just for you, making your daily purchases smarter and more rewarding.",
      color: "FF66C4",
    },
    {
      icon: "/friends.svg",
      title: "Skip the Queue for Events",
      description:
        "Get instant access to college fests, workshops, and cultural events through token-based booking. No need to stand in long queues or refresh pages. Just use your tokens, reserve your spot, and enjoy front-row access. Event organizers also benefit from verified, tamper-proof ticketing.",
      color: "FFB66D",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
      {/* Full Page Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg text-gray-700 font-semibold">
                Loading UniByte...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page-Wide Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute -top-20 -right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-tr from-blue-500/15 to-indigo-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-r from-cyan-300/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, rgba(6, 182, 212, 0.08) 1.5px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-10 left-10 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full opacity-50"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full opacity-40"
          animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-2 h-2 sm:w-3 sm:h-3 bg-indigo-400 rounded-full opacity-45"
          animate={{ y: [0, -12, 0], x: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <NavBar1 />
      <div className="flex flex-col mt-16 min-h-screen px-4 sm:px-6 md:px-8 z-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center w-full flex-1 py-6 sm:py-8 md:py-10">
          <div className="flex flex-col justify-center w-full md:w-1/2 gap-4 mb-6 md:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black">
              Welcome to <br />
              <span className="text-blue-500">UniByte</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-full md:max-w-[623px]">
              <em>
                UniByte is a blockchain-powered student platform that simplifies
                and supercharges campus life. From fee payments to event
                registrations and peer-to-peer transactions, UniByte brings Web3
                into everyday student experiences, all under one intuitive
                platform.
              </em>
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <motion.img
              src="/aboutimagehero.svg"
              alt="hero image"
              className="w-full h-auto max-w-md md:max-w-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Offers Section */}
        <div className="flex-1 relative">
          <div className="w-full text-center py-4 sm:py-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              What do <span className="text-blue-500">we</span> offer?
            </h1>
          </div>
          {/* Offers Section Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient Orbs */}
            <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-gradient-to-tr from-blue-500/10 to-cyan-300/10 rounded-full blur-2xl animate-pulse delay-700"></div>

            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 opacity-15">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 15px 15px, rgba(6, 182, 212, 0.06) 1px, transparent 0)`,
                  backgroundSize: "30px 30px",
                }}
              ></div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-5 left-5 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full opacity-40"
              animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-5 right-5 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full opacity-35"
              animate={{ y: [0, 8, 0], x: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex flex-col items-center gap-6 sm:gap-7 p-4 sm:p-5">
            {isContentLoading
              ? Array(4)
                  .fill()
                  .map((_, index) => (
                    <div
                      key={index}
                      className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6 mt-1"></div>
                        </div>
                      </div>
                    </div>
                  ))
              : offers.map((offer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <OfferCard offer={offer} />
                  </motion.div>
                ))}
          </div>
        </div>

        {/* Ending Section */}
        <EndingSection />
      </div>
    </div>
  );
}

export default About;
