import React, { useState, useEffect } from "react";
import { Calendar, Send, Eye, Clock, Wallet, RefreshCw, CheckCircle } from "lucide-react";
import NavBar3 from "./components/NavBar3";
import { useMetaMask } from "./hooks/useMetamask";
import { ethers } from 'ethers';
import { motion, AnimatePresence } from "framer-motion";

const StudentDashboard = () => {
  const { isConnected, account } = useMetaMask();
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [totalSpent, setTotalSpent] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payingFees, setPayingFees] = useState(false);
  const [feesPaid, setFeesPaid] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('feesPaid');
    const lastPayment = localStorage.getItem('lastPaymentDate');
    
    if (saved && lastPayment) {
      const paymentDate = new Date(lastPayment);
      const now = new Date();
      
      // Check if we're still in the same month
      if (paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()) {
        return JSON.parse(saved);
      } else {
        // New month, reset fees
        localStorage.removeItem('feesPaid');
        localStorage.removeItem('lastPaymentDate');
        return false;
      }
    }
    return false;
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [sendingTokens, setSendingTokens] = useState(false);

  const BITS_CONTRACT_ADDRESS = "0xEE43baf1A0D54439B684150ec377Bb6d7D58c4bC";
  const ADMIN_ACCOUNT = "0x4f91bd1143168af7268eb08b017ec785c06c0e61";
  const FEE_AMOUNT = "20000";

  // Function to get current month's due date (19th of current month)
  const getCurrentFeeDueDate = () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 19);
    return currentMonth.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Function to get next fee due date (19th of next month)
  const getNextFeeDueDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 19);
    return nextMonth.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const BITS_ABI = [
    {
      "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "transfer",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const fetchBalance = async () => {
    if (!isConnected || !account || !window.ethereum) {
      setBalance("0");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        provider
      );

      const balanceWei = await Promise.race([
        contract.balanceOf(account),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timeout")), 10000)
        )
      ]);

      const balanceFormatted = ethers.utils.formatUnits(balanceWei, 18);
      const balanceNumber = parseFloat(balanceFormatted);
      
      setBalance(balanceNumber.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }));

      // For demo purposes, set total spent as 10% of balance
      const spentAmount = (balanceNumber * 0.1);
      setTotalSpent(spentAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }));

    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
      setBalance("Error");
      setTotalSpent("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      const timer = setTimeout(() => {
        fetchBalance();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setBalance("0");
      setTotalSpent("0");
    }
  }, [isConnected, account]);

  const handleRefreshBalance = () => {
    fetchBalance();
  };

  const validateAddress = (address) => {
    try {
      return ethers.utils.isAddress(address);
    } catch {
      return false;
    }
  };

  const handleSendTokens = async () => {
    if (!isConnected || !account) {
      setSuccessMessage("");
      setError("Please connect your wallet first");
      return;
    }

    if (!walletAddress || !tokenAmount) {
      setSuccessMessage("");
      setError("Please fill in all fields");
      return;
    }

    if (!validateAddress(walletAddress)) {
      setSuccessMessage("");
      setError("Please enter a valid wallet address");
      return;
    }

    if (parseFloat(tokenAmount) <= 0) {
      setSuccessMessage("");
      setError("Please enter a valid token amount");
      return;
    }

    try {
      setSendingTokens(true);
      setError(null);
      setSuccessMessage("");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        signer
      );

      // Check balance first
      const balanceWei = await contract.balanceOf(account);
      const balanceFormatted = parseFloat(ethers.utils.formatUnits(balanceWei, 18));
      const amountToSend = parseFloat(tokenAmount);

      if (amountToSend > balanceFormatted) {
        setError(`Insufficient balance. You have ${balanceFormatted.toFixed(2)} BITS`);
        return;
      }

      // Convert amount to wei
      const amountWei = ethers.utils.parseUnits(tokenAmount, 18);
      
      // Send transaction
      const tx = await contract.transfer(walletAddress, amountWei);
      
      setSuccessMessage('Transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccessMessage(`✅ Successfully sent ${tokenAmount} BITS to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`);
        setWalletAddress("");
        setTokenAmount("");
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
        // Refresh balance after successful transaction
        setTimeout(() => {
          fetchBalance();
        }, 2000);
      } else {
        setError('Transaction failed');
      }

    } catch (err) {
      console.error('Send tokens error:', err);
      
      let errorMessage = 'Failed to send tokens';
      if (err.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH for gas fees';
      } else if (err.message.includes('gas')) {
        errorMessage = 'Gas estimation failed';
      } else if (err.message.includes('transfer amount exceeds balance')) {
        errorMessage = 'Insufficient BITS balance';
      }
      
      setError(errorMessage);
    } finally {
      setSendingTokens(false);
    }
  };

  const handlePayFees = async () => {
    if (!isConnected || !account) {
      setSuccessMessage("");
      setError("Please connect your wallet first");
      return;
    }

    try {
      setPayingFees(true);
      setError(null);
      setSuccessMessage("");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        signer
      );

      // Check if user has sufficient balance
      const balanceWei = await contract.balanceOf(account);
      const balanceFormatted = parseFloat(ethers.utils.formatUnits(balanceWei, 18));
      const feeAmountNumber = parseFloat(FEE_AMOUNT);

      if (feeAmountNumber > balanceFormatted) {
        setError(`Insufficient balance. You need ${FEE_AMOUNT} BITS but only have ${balanceFormatted.toFixed(2)} BITS`);
        return;
      }

      // Convert fee amount to wei
      const feeAmountWei = ethers.utils.parseUnits(FEE_AMOUNT, 18);
      
      // Send transaction
      const tx = await contract.transfer(ADMIN_ACCOUNT, feeAmountWei);
      
      setSuccessMessage('Fee payment transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccessMessage(`🎉 Successfully paid ${FEE_AMOUNT} BITS as fees! Your next payment is due on ${getNextFeeDueDate()}.`);
        
        // Mark fees as paid and save to localStorage
        setFeesPaid(true);
        localStorage.setItem('feesPaid', 'true');
        localStorage.setItem('lastPaymentDate', new Date().toISOString());
        
        // Clear success message after 8 seconds
        setTimeout(() => setSuccessMessage(""), 8000);
        // Refresh balance after successful payment
        setTimeout(() => {
          fetchBalance();
        }, 2000);
      } else {
        setError('Fee payment transaction failed');
      }

    } catch (err) {
      console.error('Fee payment error:', err);
      
      let errorMessage = 'Failed to pay fees';
      if (err.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH for gas fees';
      } else if (err.message.includes('transfer amount exceeds balance')) {
        errorMessage = 'Insufficient BITS balance';
      }
      
      setError(errorMessage);
    } finally {
      setPayingFees(false);
    }
  };

  // Mock data for transactions (you can update this with real data later)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <NavBar3 />
      
      {/* Main Content */}
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Connect your wallet</strong> to view your real account balance and send tokens.
                </p>
              </div>
            )}

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
                >
                  <p className="text-green-800 text-sm font-medium">
                    {successMessage}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                >
                  <p className="text-red-800 text-sm font-medium">
                    {error}
                  </p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-red-600 text-xs underline mt-1 hover:text-red-800"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top Row - Balance Cards and Image */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Balance Cards */}
            <div className="lg:col-span-1 space-y-4">
              {/* Account Balance */}
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-8 h-8" />
                    <div>
                      <h3 className="text-sm font-medium opacity-90">
                        Account Balance
                      </h3>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleRefreshBalance}
                    disabled={loading || !isConnected}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </motion.button>
                </div>

                {!isConnected ? (
                  <div className="text-center py-2">
                    <p className="text-2xl font-bold opacity-70">Connect Wallet</p>
                    <p className="text-xs opacity-60 mt-1">Connect to view balance</p>
                  </div>
                ) : loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse bg-white/20 h-8 w-32 rounded"></div>
                    <span className="text-sm opacity-70">Loading...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-2">
                    <p className="text-xl font-bold text-red-200">Error</p>
                    <p className="text-xs opacity-60">{error}</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-3xl font-bold">
                      {balance}{" "}
                      <span className="text-sm font-normal opacity-80">BITS</span>
                    </p>
                    {account && (
                      <p className="text-xs opacity-60 font-mono mt-2 bg-white/10 px-2 py-1 rounded">
                        {account.slice(0, 6)}...{account.slice(-4)}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Total Spent */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Send className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Spent
                    </h3>
                    {!isConnected ? (
                      <p className="text-xl font-bold text-gray-400">
                        Connect Wallet
                      </p>
                    ) : loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-24 rounded mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">
                        {totalSpent}{" "}
                        <span className="text-sm font-normal text-gray-600">BITS</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Pending Fees */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  feesPaid ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {feesPaid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    {feesPaid ? 'Fees Status' : 'Pending Fees'}
                  </h3>
                  {feesPaid ? (
                    <p className="text-2xl font-bold text-green-600">
                      Paid ✓
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {FEE_AMOUNT.toLocaleString()}{" "}
                      <span className="text-sm font-normal text-gray-600">BITS</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {feesPaid ? (
                  <>
                    <p className="text-sm text-green-600 font-medium">✅ All fees paid!</p>
                    <p className="text-sm text-gray-500">Next due: {getNextFeeDueDate()}</p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-700">
                        Your account is in good standing. Thank you for your payment!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Due: {getCurrentFeeDueDate()}</p>
                    <p className="text-xs text-gray-400 font-mono">
                      Admin: {ADMIN_ACCOUNT.slice(0, 8)}...{ADMIN_ACCOUNT.slice(-4)}
                    </p>
                    
                    {!isConnected ? (
                      <div className="space-y-2">
                        <button className="w-full bg-gray-100 text-gray-400 py-2 px-4 rounded-lg text-sm font-medium cursor-not-allowed">
                          Connect Wallet to Pay
                        </button>
                        <button className="w-full bg-orange-50 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                          Set Up Autopay
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <motion.button
                          onClick={handlePayFees}
                          disabled={payingFees}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          whileHover={!payingFees ? { scale: 1.02 } : {}}
                          whileTap={!payingFees ? { scale: 0.98 } : {}}
                        >
                          {payingFees ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Paying Fees...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Pay Fees Now
                            </>
                          )}
                        </motion.button>
                        <button className="w-full bg-orange-50 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                          Set Up Autopay
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Dashboard Image */}
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img
                src="/Student Dashboard.svg"
                alt="Student Dashboard Illustration"
                className="max-w-full max-h-48 object-contain"
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  transition: { duration: 0.3 }
                }}
              />
            </motion.div>
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
                    <motion.div 
                      className="p-4 bg-blue-50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-semibold text-blue-900">
                        Fee Payment Due
                      </h4>
                      <p className="text-sm text-blue-700">June 19th</p>
                    </motion.div>
                    <motion.div 
                      className="p-4 bg-green-50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-semibold text-green-900">Campus Event</h4>
                      <p className="text-sm text-green-700">June 25th</p>
                    </motion.div>
                    <motion.div 
                      className="p-4 bg-purple-50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-semibold text-purple-900">Token Reward</h4>
                      <p className="text-sm text-purple-700">June 30th</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Tokens - Updated with better functionality */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Tokens
              </h3>
              
              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Connect your wallet to send tokens</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wallet Address
                    </label>
                    <motion.input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => {
                        setWalletAddress(e.target.value);
                        // Clear messages when user types
                        if (error || successMessage) {
                          setError(null);
                          setSuccessMessage("");
                        }
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0x..."
                      disabled={sendingTokens}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tokens
                    </label>
                    <motion.input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => {
                        setTokenAmount(e.target.value);
                        // Clear messages when user types
                        if (error || successMessage) {
                          setError(null);
                          setSuccessMessage("");
                        }
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter amount"
                      step="0.01"
                      min="0"
                      disabled={sendingTokens}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                  
                  

                  <motion.button
                    onClick={handleSendTokens}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                    disabled={!walletAddress || !tokenAmount || sendingTokens}
                    whileHover={!sendingTokens ? { scale: 1.02 } : {}}
                    whileTap={!sendingTokens ? { scale: 0.98 } : {}}
                  >
                    {sendingTokens ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Tokens
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Bottom Row - Latest Transactions */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
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
                    <motion.tr
                      key={idx}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.1 }}
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;