import React, { useState } from "react";
import { Calendar, Send, Eye, Clock, Wallet } from "lucide-react";
import NavBar3 from "./components/NavBar3";

const StudentDashboard = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  // Mock data
  const transactions = [
    {
      date: "Jun 20, 2025",
      amount: "500",
      to: "0x7a2b...f4c8",
      id: "0xop7k...nbv2",
      type: "send",
    },
    {
      date: "Jun 19, 2025",
      amount: "250",
      to: "0x9f1d...a7e3",
      id: "0xmn4l...qrt9",
      type: "receive",
    },
    {
      date: "Jun 18, 2025",
      amount: "1000",
      to: "0x3c8e...b2f6",
      id: "0xgh7j...xyz1",
      type: "send",
    },
  ];

  const handleSendTokens = () => {
    if (!walletAddress || !tokenAmount) {
      alert("Please fill in all fields");
      return;
    }
    console.log("Sending", tokenAmount, "BITS to", walletAddress);
    // Add actual send logic here
    setWalletAddress("");
    setTokenAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <NavBar3 />
      
      {/* Main Content */}
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            
           
          </div>

          {/* Top Row - Balance Cards and Image */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Balance Cards */}
            <div className="lg:col-span-1 space-y-4">
              {/* Account Balance */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Wallet className="w-8 h-8" />
                  <div>
                    <h3 className="text-sm font-medium opacity-90">
                      Account Balance
                    </h3>
                    <p className="text-3xl font-bold">
                      1,000,000{" "}
                      <span className="text-sm font-normal">BITS</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Spent */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Send className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Spent
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      5,000{" "}
                      <span className="text-sm font-normal text-gray-600">BITS</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Fees */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Pending Fees</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    20,000{" "}
                    <span className="text-sm font-normal text-gray-600">BITS</span>
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Due: June 19th, 2025</p>
                <button className="w-full bg-orange-50 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                  Set Up Autopay
                </button>
              </div>
            </div>

            {/* Dashboard Image */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl flex items-center justify-center">
              <img
                src="/Student Dashboard.svg"
                alt="Student Dashboard Illustration"
                className="max-w-full max-h-48 object-contain"
              />
            </div>
          </div>

          {/* Middle Row - Calendar & Events + Send Tokens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Calendar & Events */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* Calendar */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    June 2025
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                      <div
                        key={idx}
                        className="text-center text-sm font-medium text-gray-500 p-2"
                      >
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((date) => (
                      <div
                        key={date}
                        className={`text-center p-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                          date === 19
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200"></div>

                {/* Events */}
                <div className="flex-1 lg:max-w-xs">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Events This Month
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">
                        Fee Payment Due
                      </h4>
                      <p className="text-sm text-blue-700">June 19th</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">Campus Event</h4>
                      <p className="text-sm text-green-700">June 25th</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900">Token Reward</h4>
                      <p className="text-sm text-purple-700">June 30th</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Tokens */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Tokens
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Tokens
                  </label>
                  <input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter amount"
                  />
                </div>
                <button
                  onClick={handleSendTokens}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Tokens
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row - Latest Transactions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Latest Transactions
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">To/From</th>
                    <th className="pb-3">Transaction ID</th>
                    <th className="pb-3">Type</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {transactions.map((txn, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="py-4 text-sm text-gray-900">{txn.date}</td>
                      <td className="py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {txn.amount} BITS
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-600 font-mono">
                        {txn.to}
                      </td>
                      <td className="py-4 text-sm text-gray-600 font-mono">
                        {txn.id}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            txn.type === "send"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {txn.type === "send" ? "Sent" : "Received"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
