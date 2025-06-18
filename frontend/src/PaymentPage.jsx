import React from "react";
import {
  NotebookTabs,
  Coins,
  MoveLeft,
  ScanQrCode,
  CornerRightUp,
  HandCoins,
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function PaymentPage() {
  const navigate = useNavigate();

  function handleQrClick() {
    navigate("/generate-qr");
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("submitted");
  }

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* Background Orbs and Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-tr from-blue-500/15 to-indigo-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-r from-cyan-300/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20px 20px, rgba(6, 182, 212, 0.08) 1.5px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

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

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex justify-center items-center px-4 py-10">
        <div className="w-full max-w-6xl shadow-md hover:shadow-lg transition-all duration-300 rounded-[30px] bg-white p-5 flex flex-col">
          {/* Header */}
          <div className="border-b-2 px-2 border-gray-500 py-3 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-4xl sm:text-5xl text-[#336BFB] font-bold">
              ByteMe
            </h1>
            <div className="text-sm flex relative items-center w-full sm:w-[40%]">
              <h1 className="ml-2 flex items-center gap-2 text-blue-800 hover:text-blue-500 transition-all duration-300 cursor-pointer">
                <MoveLeft size={18} />
                Go back
              </h1>
              <img
                src="/dashboardimage.svg"
                alt="logo"
                className="w-16 h-16 sm:w-20 sm:h-20 absolute right-0 hidden sm:block"
              />
            </div>
          </div>

          {/* Form + QR */}
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left - Form */}
            <form onSubmit={handleSubmit} className="w-full md:w-[70%]">
              <div className="flex flex-col gap-10 w-full md:border-r md:pr-6">
                {/* Wallet Address */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xl sm:text-2xl font-semibold text-[#666666]"
                    htmlFor="address"
                  >
                    Wallet Address
                  </label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <NotebookTabs size={20} />
                    </span>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter wallet address"
                      className="rounded-md bg-[#0000000D] placeholder:italic outline-none w-full pl-10 py-2"
                    />
                  </div>
                </div>

                {/* Token Amount */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xl sm:text-2xl font-semibold text-[#666666]"
                    htmlFor="amount"
                  >
                    Token Amount
                  </label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Coins size={20} />
                    </span>
                    <input
                      type="number"
                      name="amount"
                      placeholder="Enter token amount"
                      className="rounded-md bg-[#0000000D] placeholder:italic outline-none w-full pl-10 py-2"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-md bg-[#336BFB] cursor-pointer hover:scale-105 transition-all duration-300 px-4 py-2 w-full sm:w-[140px] flex justify-center items-center text-white"
                  >
                    <span className="text-lg flex gap-2 items-center">
                      Pay
                      <HandCoins size={20} />
                    </span>
                  </button>
                </div>
              </div>
            </form>

            {/* Right - QR */}
            <div className="w-full md:w-[30%] flex justify-center items-center flex-col">
              <ScanQrCode
                size={120}
                color="#336BFB"
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={handleQrClick}
              />
              <h1 className="italic text-sm text-[#666666] mt-2 flex items-center gap-1 text-center">
                Click here to get the QR Code!
                <CornerRightUp />
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
