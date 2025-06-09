import React from "react";
import NavBar1 from "./NavBar1";
import { TypewriterEffectDemo } from "./typewriterEffect";
import { Link } from "react-router";
import { DotBackgroundDemo } from "./ui/DotBackgroundDemo";
import { ConnectButton } from "./ConnectButton";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Star, 
  Zap, 
  Shield, 
  Coins,
  Users,
  TrendingUp
} from "lucide-react";

function LandingPage1() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.1) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-40"
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-3 h-3 bg-indigo-400 rounded-full opacity-50"
          animate={{ y: [0, -25, 0], x: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Left Content */}
            <motion.div
              className="flex-1 max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              {/* Main Heading */}
              <div className="mb-6">
                <TypewriterEffectDemo />
              </div>

              {/* Subheading */}
              <motion.p
                className="text-xl text-gray-600 leading-relaxed mb-10   max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Ditch the cash, skip the queues, and forget about the paperwork — 
                all using crypto on one seamless platform built for students.
              </motion.p>

              {/* Feature highlights */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {[
                  { icon: Shield, text: "Secure & Safe", color: "text-green-600 bg-green-50" },
                  { icon: Zap, text: "Lightning Fast", color: "text-yellow-600 bg-yellow-50" },
                  { icon: Coins, text: "Easy Payments", color: "text-blue-600 bg-blue-50" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      <feature.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group sm:ml-4"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                  <div className="relative">
                    <ConnectButton />
                  </div>
                </motion.div>

                <motion.button
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 font-medium hover:text-blue-600 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                {[
                  { number: "50K+", label: "Students", icon: Users },
                  { number: "99.9%", label: "Uptime", icon: Shield },
                  { number: "₹2M+", label: "Transacted", icon: TrendingUp }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              className="flex-1 flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <div className="relative">
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl scale-110"></div>
                
                {/* Main image */}
                <motion.img
                  src="/HeroImage.svg"
                  alt="UniByte Hero"
                  className="relative z-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] object-contain"
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: 2,
                    filter: "drop-shadow(0 20px 25px rgba(59, 130, 246, 0.15))",
                    transition: { type: "spring", stiffness: 100, damping: 10 }
                  }}
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 1, 0, -1, 0]
                  }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                />

                {/* Floating elements around image */}
                <motion.div
                  className="absolute top-10 -left-5 w-8 h-8 bg-blue-500 rounded-full opacity-60"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-20 -right-5 w-6 h-6 bg-purple-500 rounded-full opacity-50"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                  className="absolute top-1/2 -left-10 w-4 h-4 bg-indigo-500 rounded-full opacity-70"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

     
    </div>
  );
}

export default LandingPage1;