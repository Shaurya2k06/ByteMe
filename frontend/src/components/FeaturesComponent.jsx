import React from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Users, 
  ShoppingBag, 
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";

function FeaturesComponent() {
  const featureBoxes = [
    {
      icon: "/cash.svg",
      fallbackIcon: CreditCard,
      text: "Pay Fees & Much More",
      description: "Seamlessly handle all your campus payments with secure crypto transactions",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    {
      icon: "/paperclip.svg",
      fallbackIcon: Users,
      text: "Peer-to-Peer Transfers",
      description: "Send tokens instantly to friends and classmates with zero hassle",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100"
    },
    {
      icon: "/bag.svg",
      fallbackIcon: ShoppingBag,
      text: "Exciting Offers on 100+ Items",
      description: "Unlock exclusive discounts and deals across campus stores",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100"
    },
    {
      icon: "/friends.svg",
      fallbackIcon: Calendar,
      text: "Skip the Queue for Events",
      description: "Get priority access to events with instant token-based booking",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100"
    },
  ];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative px-6 py-20 w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-hidden" id="features">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >

          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campus Life
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how UniByte transforms your daily campus experience with cutting-edge blockchain technology
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featureBoxes.map((feature, index) => {
            const FallbackIcon = feature.fallbackIcon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className={`
                  relative overflow-hidden h-full
                  bg-white rounded-2xl shadow-lg border border-gray-100
                  hover:shadow-2xl transition-all duration-500
                  hover:-translate-y-2
                  p-8 flex flex-col items-center text-center
                `}>
                  {/* Background gradient on hover */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 
                    group-hover:opacity-5 transition-opacity duration-500 rounded-2xl
                  `}></div>
                  
                  {/* Icon container */}
                  <div className={`
                    relative mb-6 p-4 rounded-2xl ${feature.bgColor} ${feature.hoverColor}
                    transition-all duration-300 group-hover:scale-110
                  `}>
                    <div className="relative w-16 h-16">
                      <img
                        className="w-full h-full object-contain"
                        src={feature.icon}
                        alt="feature icon"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <FallbackIcon 
                        className={`w-full h-full bg-gradient-to-br ${feature.color} bg-clip-text text-transparent hidden`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                      {feature.text}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {feature.description}
                    </p>

                    {/* Hover arrow */}
                    <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`
                        flex items-center gap-2 text-sm font-medium
                        bg-gradient-to-r ${feature.color} bg-clip-text text-transparent
                      `}>
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300" 
                       style={{ background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>


      </div>
    </div>
  );
}

export default FeaturesComponent;