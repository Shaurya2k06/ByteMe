import React from "react";
import { Search, ShoppingBag, Star, Tag, QrCode, Wallet } from "lucide-react";
import NavBar3 from "./components/NavBar3.jsx";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// BITS Token Configuration
const BITS_TOKEN_ADDRESS = "0xfEc060d0CF069ce6b1518445dB538058e9eE063d";
const SHOP_WALLET_ADDRESS = "0x4f91bD1143168aF7268EB08B017eC785C06C0E61"; 

// ERC-20 Transfer Function ABI
const ERC20_TRANSFER_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  }
];

// Web3 Integration Hook with BITS Token Support
const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bitsBalance, setBitsBalance] = useState("0");

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        setIsConnected(true);
        await getBitsBalance(accounts[0]);
        
        return accounts[0];
      } catch (error) {
        console.error('Error connecting wallet:', error);
        
        return null;
      } finally {
        setIsLoading(false);
      }
    } else {
    
      return null;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setBitsBalance("0");
  };

  const getBitsBalance = async (address) => {
    try {
      if (!window.ethereum) return;
      
      // Create contract call data for balanceOf
      const balanceOfData = '0x70a08231' + address.slice(2).padStart(64, '0');
      
      const result = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: BITS_TOKEN_ADDRESS,
          data: balanceOfData
        }, 'latest']
      });
      
      // Convert hex result to decimal and format (assuming 18 decimals)
      const balance = parseInt(result, 16);
      const formattedBalance = (balance / Math.pow(10, 18)).toFixed(2);
      setBitsBalance(formattedBalance);
    } catch (error) {
      console.error('Error fetching BITS balance:', error);
      setBitsBalance("0");
    }
  };

  const sendBitsToken = async (toAddress, amountInBits, itemName) => {
    if (!window.ethereum || !account) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Convert amount to wei (assuming 18 decimals for BITS token)
      const amountInWei = (amountInBits * Math.pow(10, 18)).toString();
      const amountHex = '0x' + parseInt(amountInWei).toString(16);
      
      // Create transfer function call data
      const transferData = '0xa9059cbb' + // transfer function selector
        toAddress.slice(2).padStart(64, '0') + // to address (32 bytes)
        amountHex.slice(2).padStart(64, '0'); // amount (32 bytes)

      const transactionParameters = {
        to: BITS_TOKEN_ADDRESS,
        from: account,
        data: transferData,
        gas: '0x11170', // 70000 gas limit for ERC-20 transfer
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      toast.success(`Purchase successful! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Refresh balance after successful transaction
      setTimeout(() => getBitsBalance(account), 2000);
      
      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient BITS balance');
      } else {
        toast.error('Transaction failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            await getBitsBalance(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await getBitsBalance(accounts[0]);
        } else {
          setAccount(null);
          setIsConnected(false);
          setBitsBalance("0");
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    account,
    isConnected,
    isLoading,
    bitsBalance,
    connectWallet,
    disconnectWallet,
    sendBitsToken,
    getBitsBalance
  };
};

// Enhanced Card Component with BITS Token Integration
const ShopCard = ({ data, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { account, isConnected, bitsBalance, connectWallet, sendBitsToken } = useWeb3();

  const handlePurchase = async () => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    const itemPrice = data?.itemPrice || 10;
    const itemName = data?.itemName || "Red Sauce Pasta";
    
    // Check if user has enough BITS
    if (parseFloat(bitsBalance) < itemPrice) {
      toast.error(`Insufficient BITS balance. You need ${itemPrice} BITS but only have ${bitsBalance} BITS.`);
      return;
    }

    setIsPurchasing(true);
    
    try {
      const txHash = await sendBitsToken(SHOP_WALLET_ADDRESS, itemPrice, itemName);
      
      if (txHash) {
        // Record the purchase in backend
        try {
          await axios.post('https://byteme-ue8b.onrender.com/shop/purchase', {
            itemId: data?._id,
            itemName: itemName,
            price: itemPrice,
            walletAddress: account,
            transactionHash: txHash,
            tokenAddress: BITS_TOKEN_ADDRESS
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
          });
          
          toast.success(`${itemName} purchased successfully with ${itemPrice} BITS!`);
        } catch (apiError) {
          console.error('Error recording purchase:', apiError);
          toast.warning('Purchase completed but failed to record. Please contact support with transaction hash: ' + txHash);
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden group cursor-pointer"
      whileHover={{ 
        y: -4, 
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="relative w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        {/* Subtle animated elements */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 bg-gray-400 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
        
        <motion.div
          className="absolute bottom-4 left-4 w-2 h-2 bg-gray-400 rounded-full"
          animate={{ 
            scale: [1, 2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            delay: index * 0.15
          }}
        />

        {/* Main icon */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            rotate: isHovered ? 2 : 0
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <ShoppingBag className="w-8 h-8 text-gray-600" />
          </div>
        </motion.div>

        {/* Product tag */}
        <motion.div 
          className="absolute top-3 left-3 bg-gray-900 text-white text-xs px-2 py-1 rounded-md font-medium"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: index * 0.05 + 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
        >
          <span>new</span>
        </motion.div>
      </div>

      <motion.div 
        className="p-5"
        animate={{ opacity: isHovered ? 1 : 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <motion.h3 
          className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.3 }}
        >
          {data?.itemName || "Red Sauce Pasta"}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.35 }}
        >
          {data?.itemDescription || "Experience Italy's classic tangy & cheesy flavor in every bite."}
        </motion.p>
        
        <div className="flex justify-between items-center">
          <motion.div
            className="flex flex-col gap-1"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">
                {data?.itemPrice ? `${data.itemPrice} BITS` : "10 BITS"}
              </span>
            </div>
          </motion.div>
          
          <motion.button 
            onClick={handlePurchase}
            disabled={isPurchasing}
            className={`text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              isPurchasing 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gray-900 hover:bg-gray-800"
            }`}
            whileHover={!isPurchasing ? { x: 2, scale: 1.02 } : {}}
            whileTap={!isPurchasing ? { scale: 0.98 } : {}}
          >
            {isPurchasing ? (
              <>
                <motion.div
                  className="w-3 h-3 border border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="font-medium">Buying...</span>
              </>
            ) : (
              <>
                <span className="font-medium">Buy Now</span>
                <motion.div
                  animate={{ x: isHovered ? 2 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Wallet className="w-4 h-4" />
                </motion.div>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Wallet Connection Component with BITS Balance
const WalletStatus = () => {
  const { account, isConnected, isLoading, bitsBalance, connectWallet, disconnectWallet } = useWeb3();

  return (
    <motion.div
      className="fixed top-20 right-6 z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      {isConnected ? (
        <motion.div
          className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="flex flex-col">
            <span className="text-xs text-green-600 font-medium">Connected</span>
            <span className="text-xs text-green-700 font-mono">
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </span>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <Wallet className="w-3 h-3" />
              <span className="font-medium">{bitsBalance} BITS</span>
            </div>
          </div>
          <motion.button
            onClick={disconnectWallet}
            className="text-green-600 hover:text-green-800 text-xs underline"
            whileHover={{ scale: 1.05 }}
          >
            Disconnect
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          onClick={connectWallet}
          disabled={isLoading}
          className={`bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
          whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-4 h-4 border border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

// Main Shop Page Component
const ShopPage = () => {
  const navigate = useNavigate();
  const cards = new Array(9).fill(0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("jwt");

        const res = await axios.get("https://byteme-ue8b.onrender.com/shop/getItems", {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        });
        setResults(res.data.items || res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        setIsLoading(true);
        axios
          .get(`https://byteme-ue8b.onrender.com/shop/search?query=${encodeURIComponent(query)}`)
          .then((res) => {
            setResults(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Search error:", err);
            setIsLoading(false);
          });
      } else {
        fetchAllItems();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleQRRedirect = () => {
    navigate('/scan');
  };

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced Background Elements - Made more visible */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* ...existing background animations... */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`float-${i}`}
            className="absolute w-2 h-2 bg-gray-400 rounded-full opacity-30"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`grid-${i}`}
            className="absolute w-12 h-12 border-2 border-gray-300/40 rounded"
            style={{
              left: `${15 + (i % 4) * 25}%`,
              top: `${20 + Math.floor(i / 4) * 35}%`,
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          />
        ))}

        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent"
            style={{
              width: `${150 + Math.random() * 250}px`,
              left: `${Math.random() * 60}%`,
              top: `${15 + i * 15}%`,
            }}
            animate={{
              x: [-80, 80, -80],
              opacity: [0, 0.8, 0],
              scaleX: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute border-2 border-gray-400/50 rounded-full"
            style={{
              width: `${30 + i * 15}px`,
              height: `${30 + i * 15}px`,
              left: `${20 + i * 25}%`,
              top: `${25 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.3, 0.9, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.4, 0.3],
            }}
            transition={{
              duration: 5 + i * 1.5,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeInOut"
            }}
          />
        ))}

        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute w-3 h-3 bg-gray-400/40 rounded-full"
            style={{
              left: `${25 + i * 7}%`,
              top: "55%",
            }}
            animate={{
              y: [0, -20, 0, 20, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
        
        <motion.div
          className="absolute top-20 right-16 w-40 h-40 border-2 border-gray-300/60 rounded-full"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div
          className="absolute bottom-32 left-12 w-32 h-32 border-2 border-gray-300/60 rounded-lg"
          animate={{ 
            rotate: [0, -360],
            x: [0, 15, 0],
            y: [0, -15, 0],
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.div
          className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400/40 to-transparent transform rotate-12"
          animate={{
            opacity: [0, 0.8, 0],
            scaleX: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400/40 to-transparent transform -rotate-12"
          animate={{
            opacity: [0, 0.8, 0],
            scaleX: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 2.5,
            ease: "easeInOut"
          }}
        />

        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-gray-500/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-25, 25],
              x: [-15, 15],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}

        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={`pulse-${i}`}
            className="absolute border border-gray-400/30 rounded-full"
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${30 + i * 20}%`,
              top: `${40 + i * 10}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut"
            }}
          />
        ))}

        <motion.div
          className="absolute top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-gray-200/30 to-gray-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-gradient-to-r from-gray-300/30 to-gray-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: 1.5,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        <NavBar3 />

        {/* Content Wrapper */}
        <motion.div 
          className="px-6 py-20 flex flex-col gap-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-16">
            {/* Left div: header + search */}
            <motion.div 
              className="flex flex-col justify-center items-start gap-8 w-full lg:w-[60%]"
              variants={cardVariants}
            >
              <div className="w-full space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.h1 
                    className="text-5xl lg:text-6xl font-light text-gray-900 leading-tight"
                    animate={{ 
                      letterSpacing: ["0.02em", "0.01em", "0.02em"]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Student{" "}
                    <motion.span 
                      className="font-medium"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Shop
                    </motion.span>
                  </motion.h1>
                </motion.div>
                
                <motion.p 
                  className="text-gray-500 text-lg max-w-md font-light"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Seamless. Fast. Secure.
                </motion.p>
              </div>

              {/* Minimal Search Bar with QR Button */}
              <motion.div
                className="flex items-center gap-3 max-w-lg w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Search Bar */}
                <motion.div 
                  className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200/50 focus-within:border-gray-300 transition-all duration-200"
                  whileFocus={{ scale: 1.01 }}
                >
                  <Search className="text-gray-400 w-5 h-5 mr-3" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {isLoading && (
                    <motion.div
                      className="w-4 h-4 border border-gray-300 border-t-gray-600 rounded-full ml-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </motion.div>

                {/* QR Code Button */}
                <motion.button
                  onClick={handleQRRedirect}
                  className="bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition-all duration-200"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Scan QR Code"
                >
                  <QrCode className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right div: image */}
            <motion.div 
              className="flex justify-center items-center w-full lg:w-[40%]"
              variants={cardVariants}
            >
              <motion.img 
                src="/shopimage.svg" 
                alt="Shop illustration"
                className="max-w-full h-auto max-h-80 object-contain opacity-80"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.02,
                  opacity: 1,
                  transition: { duration: 0.3 }
                }}
              />
            </motion.div>
          </div>

          {/* Cards Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Loading skeleton cards
                Array.from({ length: 6 }, (_, idx) => (
                  <motion.div
                    key={`loading-${idx}`}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="h-40 bg-gray-50 relative overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent"
                        animate={{ x: [-200, 200] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <motion.div 
                        className="h-4 bg-gray-100 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div 
                        className="h-3 bg-gray-100 rounded w-3/4"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2
                        }}
                      />
                      <div className="flex justify-between items-center pt-2">
                        <motion.div 
                          className="h-4 bg-gray-100 rounded w-16"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4
                          }}
                        />
                        <motion.div 
                          className="h-6 bg-gray-100 rounded w-20"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.6
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : results.length > 0 ? (
                results.map((item, idx) => (
                  <ShopCard key={`item-${idx}`} data={item} index={idx} />
                ))
              ) : (
                cards.map((_, idx) => (
                  <ShopCard key={`placeholder-${idx}`} index={idx} />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* No Results Message */}
          {!isLoading && results.length === 0 && query.trim() !== "" && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Search className="w-6 h-6 text-gray-400" />
              </motion.div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nothing found</h3>
              <p className="text-gray-400 font-light">Try different keywords</p>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ShopPage;