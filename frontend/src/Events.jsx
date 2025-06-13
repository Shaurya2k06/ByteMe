import React, { useState, useRef, useEffect } from "react";
import NavBar3 from "./components/NavBar3";
import { ChevronLeft, ChevronRight, Search, Calendar, MapPin, Tag, Wallet, CheckCircle } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";

// BITS Token Configuration
const BITS_TOKEN_ADDRESS = "0xfEc060d0CF069ce6b1518445dB538058e9eE063d";
const ADMIN_WALLET_ADDRESS = "0x4f91bD1143168aF7268EB08B017eC785C06C0E61";

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
      toast.error('MetaMask not detected. Please install MetaMask!');
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

  const sendBitsToken = async (toAddress, amountInBits, eventName) => {
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

      toast.success(`Registration successful! Transaction: ${txHash.slice(0, 10)}...`);
      
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

function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const carouselRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const categories = ["All", "Tech", "Cultural", "Sports", "Others"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:9092/events/getAllEvents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        const mappedEvents = response.data.map((event) => ({
          id: event._id,
          icon: event.eventImageUrl || "https://source.unsplash.com/random/400x300?event",
          title: event.eventName,
          bits: event.amountToBePaid,
          description: event.eventDescription,
          date: new Date(event.eventDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          tags: event.tags,
          venue: event.eventLocation,
        }));

        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const pics = [
    { id: 1, name: "Symphony 2025", icon: "/symphony.svg" },
    { id: 2, name: "Techniez '25", icon: "/techniez.svg" },
    { id: 3, name: "Art Exhibition", icon: "/art.svg" },
  ];

  const scrollToIndex = (index) => {
    const container = carouselRef.current;
    if (container && container.children[index]) {
      const scrollLeft = container.children[index].offsetLeft;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % pics.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + pics.length) % pics.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (event.tags &&
        event.tags.some((tag) =>
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        ));

    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
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

        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={`spiral-${i}`}
            className="absolute w-1.5 h-1.5 bg-gray-400/40 rounded-full"
            style={{
              left: `${30 + Math.cos(i * 1.2) * 20}%`,
              top: `${40 + Math.sin(i * 1.2) * 20}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.5, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`hex-${i}`}
            className="absolute w-8 h-8 border border-gray-300/30"
            style={{
              left: `${40 + (i % 3) * 15}%`,
              top: `${30 + Math.floor(i / 3) * 20}%`,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
            animate={{
              rotate: [0, 120, 240, 360],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}

        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={`diamond-${i}`}
            className="absolute w-6 h-6 border border-gray-300/40 transform rotate-45"
            style={{
              left: `${70 + i * 5}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              y: [0, -10, 0, 10, 0],
              rotate: [45, 225, 405],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-0.5 h-0.5 bg-gray-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))}

        <motion.div
          className="absolute top-1/2 left-1/2 w-48 h-48 border border-gray-200/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 border border-gray-200/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }}
        />
      </div>

      <div className="relative z-10">
        <NavBar3 />
        <div className="h-16"></div>

        {/* Content Wrapper */}
        <motion.div 
          className="px-6 py-12 flex flex-col gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <div className="flex w-full items-center gap-16">
            {/* Left: Header */}
            <motion.div 
              className="flex flex-col gap-6 w-[40%]"
              variants={cardVariants}
            >
              <motion.h1 
                className="text-5xl font-light text-gray-900 leading-tight"
                animate={{ 
                  letterSpacing: ["0.02em", "0.01em", "0.02em"]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Upcoming{" "}
                <motion.span 
                  className="font-medium"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Events
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-gray-500 text-lg font-light"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Beyond the classroom
              </motion.p>
            </motion.div>

            {/* Right: Carousel */}
            <motion.div 
              className="relative w-[60%] flex items-center justify-center"
              variants={cardVariants}
            >
              <motion.button
                onClick={handlePrev}
                className="absolute left-4 z-10 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full p-2 hover:bg-white transition-all duration-200"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </motion.button>

              <div
                ref={carouselRef}
                className="flex w-full overflow-hidden scroll-smooth no-scrollbar"
              >
                {pics.map((pic, index) => (
                  <motion.div
                    key={pic.id}
                    className="min-w-full h-[200px] flex flex-col items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.img
                      src={pic.icon}
                      alt={pic.name}
                      className="w-full h-[200px] object-cover rounded-xl shadow-sm border border-gray-100"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span 
                      className="mt-3 font-medium text-gray-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {pic.name}
                    </motion.span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={handleNext}
                className="absolute right-4 z-10 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full p-2 hover:bg-white transition-all duration-200"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={20} className="text-gray-600" />
              </motion.button>
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div 
              className="flex items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200/50 w-[50%] focus-within:border-gray-300 transition-all duration-200"
              whileFocus={{ scale: 1.01 }}
            >
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </motion.div>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex justify-center items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Events Grid */}
          <motion.div
            className="flex flex-col gap-6 items-center"
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }, (_, idx) => (
                  <motion.div
                    key={`loading-${idx}`}
                    className="w-[80%] h-[200px] bg-white rounded-xl border border-gray-100 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex h-full">
                      <div className="w-[30%] h-full bg-gray-50 relative overflow-hidden">
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
                      <div className="w-[70%] p-6 space-y-4">
                        <motion.div 
                          className="h-4 bg-gray-100 rounded w-3/4"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.div 
                          className="h-3 bg-gray-100 rounded w-1/2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2
                          }}
                        />
                        <motion.div 
                          className="h-3 bg-gray-100 rounded w-2/3"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    index={index} 
                    registeredEvents={registeredEvents}
                    setRegisteredEvents={setRegisteredEvents}
                  />
                ))
              ) : (
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
                    <Calendar className="w-6 h-6 text-gray-400" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No events found</h3>
                  <p className="text-gray-400 font-light">Try different search terms or categories</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
      
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
}

function EventCard({ event, index, registeredEvents, setRegisteredEvents }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { account, isConnected, bitsBalance, connectWallet, sendBitsToken } = useWeb3();
  
  const isRegistered = registeredEvents.has(event.id);

  const handleRegister = async () => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    // Check if user has enough BITS
    if (parseFloat(bitsBalance) < event.bits) {
      toast.error(`Insufficient BITS balance. You need ${event.bits} BITS but only have ${bitsBalance} BITS.`);
      return;
    }

    setIsRegistering(true);
    
    try {
      // Send BITS token payment first
      const txHash = await sendBitsToken(ADMIN_WALLET_ADDRESS, event.bits, event.title);
      
      if (txHash) {
        // Then register with the backend
        try {
          await axios.post(
            "http://localhost:9092/events/joinEvent",
            { 
              eventId: event.id,
              transactionHash: txHash,
              tokenAddress: BITS_TOKEN_ADDRESS,
              amountPaid: event.bits,
              walletAddress: account
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          );
          
          // Mark as registered
          setRegisteredEvents(prev => new Set([...prev, event.id]));
          toast.success(`Successfully registered for ${event.title} with ${event.bits} BITS!`);
        } catch (apiError) {
          console.error("Backend registration failed:", apiError);
          toast.warning('Payment completed but failed to record registration. Please contact support with transaction hash: ' + txHash);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <motion.div 
      className="w-[80%] bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        y: -4, 
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex h-[200px]">
        {/* Image Section */}
        <div className="w-[30%] h-full relative overflow-hidden">
          <motion.img
            src={event.icon}
            alt={event.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Subtle animated elements */}
          <motion.div
            className="absolute top-3 right-3 w-1.5 h-1.5 bg-white/60 rounded-full"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: index * 0.1
            }}
          />
        </div>

        {/* Content Section */}
        <motion.div 
          className="w-[70%] flex flex-col justify-between px-6 py-4"
          animate={{ opacity: isHovered ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex items-center gap-1 text-sm text-gray-500"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-1 text-sm text-gray-600 font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Tag className="w-4 h-4" />
                <span>{event.bits} BITS</span>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-2 flex-1">
            <motion.h3 
              className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.1 }}
            >
              {event.title}
            </motion.h3>
            
            <motion.p 
              className="text-sm text-gray-600 leading-relaxed line-clamp-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.15 }}
            >
              {event.description}
            </motion.p>
            
            <motion.div 
              className="flex items-center gap-1 text-sm text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ x: 2 }}
            >
              <MapPin className="w-4 h-4" />
              <span>{event.venue}</span>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-1 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.25 }}
            >
              <span className="font-medium">Tags:</span>
              <span>{event.tags}</span>
            </motion.div>
            
            {isRegistered ? (
              <motion.div
                className="flex items-center gap-2 text-green-600 text-sm font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Registered</span>
              </motion.div>
            ) : (
              <motion.button
                onClick={handleRegister}
                disabled={isRegistering}
                className={`text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                  isRegistering 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
                whileHover={!isRegistering ? { scale: 1.02, x: 2 } : {}}
                whileTap={!isRegistering ? { scale: 0.98 } : {}}
              >
                {isRegistering ? (
                  <>
                    <motion.div
                      className="w-3 h-3 border border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Register</span>
                    <Wallet className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Events;