import React from "react";
import { Search, ShoppingBag, Star, Sparkles, Tag } from "lucide-react";
import NavBar3 from "./components/NavBar3.jsx";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Enhanced Card Component
const ShopCard = ({ data, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-500 group"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-2 w-4 h-4 bg-blue-300 rounded-full blur-sm"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-purple-300 rounded-full blur-sm"></div>
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-pink-300 rounded-full blur-md"></div>
        </div>

        {/* Image Placeholder */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl">
            <ShoppingBag className="w-12 h-12 text-gray-600" />
          </div>
        </motion.div>

        {/* Bestseller Tag */}
        <motion.div 
          className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
        >
          <Star className="w-3 h-3 fill-current" />
          <span>bestseller</span>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="p-6">
        <motion.h3 
          className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {data?.itemName || "Red Sauce Pasta"}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {data?.itemDescription || "Experience Italy's classic tangy & cheesy flavor in every bite."}
        </motion.p>
        
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-1 bg-blue-100 rounded-lg">
              <Tag className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-blue-600 font-bold text-lg">
              {data?.itemPrice ? `${data.itemPrice} BITS` : "10 BITS"}
            </span>
          </motion.div>
          
          <motion.button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 group/btn"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-medium">Get Now!</span>
            <ShoppingBag className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Shop Page Component
const ShopPage = () => {
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

  // Floating background elements
  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-30"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [-10, 10, -10],
        x: [-5, 5, -5],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  ));

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements}
        
        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-blue-200/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 border border-purple-200/30 rounded-lg"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <NavBar3 />

        {/* Content Wrapper */}
        <motion.div 
          className="px-6 py-24 flex flex-col gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-12">
            {/* Left div: header + search */}
            <motion.div 
              className="flex flex-col justify-center items-start gap-8 w-full lg:w-[60%]"
              variants={cardVariants}
            >
              <div className="w-full space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                    Your One-Stop{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Student Shop!
                    </span>
                  </h1>
                </motion.div>
                
                <motion.p 
                  className="text-gray-600 text-lg max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Your digital wallet just became your favorite shopping tool.
                </motion.p>
              </div>

              {/* Enhanced Search Bar */}
              <motion.div
                className="relative max-w-md w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex items-center bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:border-blue-400/50">
                  <div className="p-2 bg-gray-100 rounded-xl mr-3">
                    <Search className="text-gray-600 w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {isLoading && (
                    <motion.div
                      className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full ml-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
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
                className="max-w-full h-auto max-h-96 object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  transition: { duration: 0.3 }
                }}
              />
            </motion.div>
          </div>

          {/* Cards Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Loading skeleton cards
                Array.from({ length: 6 }, (_, idx) => (
                  <motion.div
                    key={`loading-${idx}`}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-20" />
                        <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-24" />
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
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">Try searching with different keywords</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopPage;