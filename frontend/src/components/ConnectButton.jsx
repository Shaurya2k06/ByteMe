import { useState, useRef, useEffect } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import { Check, Copy, LogOut, Wallet, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export function ConnectButton() {
  const { isConnected, account, connect, disconnect } = useMetaMask();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  const [isAssigningWallet, setIsAssigningWallet] = useState(false);
  const [hasAssignedWallet, setHasAssignedWallet] = useState(false);
  const dropdownRef = useRef(null);


  const assignWalletToUser = async (walletAddress) => {
    try {
      setIsAssigningWallet(true);
      const token = localStorage.getItem("jwt");
      
      if (!token) {
        toast.error("Please log in to assign wallet address");
        return false;
      }

      const response = await axios.patch(
        "http://localhost:3000/user/updateWallet",
        { address: walletAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        toast.success("Wallet address assigned to your account!");
        setHasAssignedWallet(true);
        return true;
      }
    } catch (error) {
      console.error("Error assigning wallet:", error);
      
      if (error.response?.status === 404) {
        toast.error("Please log in to assign wallet address");
      } else if (error.response?.status === 400) {
        toast.error("Invalid wallet address");
      } else {
        toast.error("Failed to assign wallet address. Please try again.");
      }
      return false;
    } finally {
      setIsAssigningWallet(false);
    }
  };

  useEffect(() => {
    const assignWalletOnConnection = async () => {
      if (isConnected && account && !hasAssignedWallet && !isAssigningWallet) {
        const token = localStorage.getItem("jwt");
        if (token) {
          await assignWalletToUser(account);
        }
      }
    };

    assignWalletOnConnection();
  }, [isConnected, account, hasAssignedWallet, isAssigningWallet]);

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };  const handleClick = async () => {
    if (isConnected) {
      setShowDropdown(!showDropdown);
    } else {
      setIsLoading(true);
      try {
        await connect();
        toast.success("Wallet connected successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Give more time for wallet assignment
      } catch (error) {
        console.error("Connection error:", error);
        toast.error("Failed to connect wallet");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log("Attempting to disconnect...");
      setShowDropdown(false);
      await disconnect();
      toast.success("Wallet disconnected successfully");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-center w-full" ref={dropdownRef}>
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          relative overflow-hidden group
          ${isConnected 
            ? 'bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-800 hover:bg-white hover:shadow-lg' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'
          }
          px-6 py-3 rounded-xl font-medium text-base
          transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          flex items-center gap-3 min-w-[180px] max-w-[220px] justify-center
          whitespace-nowrap
        `}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >

        {!isConnected && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
        )}
          {/* Loading spinner */}
        {(isLoading || isAssigningWallet) && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-600/90 rounded-xl">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative flex items-center gap-3">
          <div className={`p-1 rounded-lg ${isConnected ? 'bg-gray-100' : 'bg-white/20'}`}>
            <Wallet className="w-4 h-4" />
          </div>
            <span className="font-medium text-sm lg:text-base truncate">
            {isAssigningWallet 
              ? "Assigning Wallet..." 
              : isConnected 
                ? formatAddress(account) 
                : "Connect Wallet"
            }
          </span>
          
          {isConnected && (
            <ChevronDown 
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`} 
            />
          )}
        </div>

        {/* Shimmer effect for non-connected state */}
        {!isConnected && (
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white/98 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/80 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 border-b border-gray-200/50">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Wallet Connected</h3>
                  <p className="text-xs text-gray-600">MetaMask</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2.5">
              {/* Address display */}
              <motion.div
                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                onClick={copyToClipboard}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 mb-0.5">Wallet Address</p>
                  <p className="text-xs text-gray-600 font-mono truncate">{account}</p>
                </div>
                <motion.button 
                  className="ml-2 p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-600" />
                  )}                </motion.button>
              </motion.div>

              {/* Manual assign wallet button */}
              <motion.button
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-all duration-200 group text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => assignWalletToUser(account)}
                disabled={isAssigningWallet}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isAssigningWallet ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Assign to Account</span>
                  </>
                )}
              </motion.button>

              {/* Disconnect button */}
              <motion.button
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-200 group text-sm"
                onClick={handleDisconnect}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                <span>Disconnect Wallet</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};