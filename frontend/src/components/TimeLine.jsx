import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Sparkles, 
  ArrowDown,
  Wallet,
  Coins,
  ShoppingBag,
  Calendar,
  BarChart3,
  Settings
} from "lucide-react";

function TimeLine() {
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      title: "Create Account & Connect Wallet",
      description: "Sign up in seconds to get your very own secure Byte wallet.",
      icon: "/step1.svg",
      fallbackIcon: Wallet,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      step: 2,
      title: "Get your Tokens",
      description: "Earn or buy tokens through events, tasks, or the marketplace.",
      icon: "/step2.svg",
      fallbackIcon: Coins,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      step: 3,
      title: "Explore the Marketplace",
      description: "Use your tokens to redeem rewards, tickets, or collectibles.",
      icon: "/step3.svg",
      fallbackIcon: ShoppingBag,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      step: 4,
      title: "Join Events",
      description: "Use tokens to register for campus-wide events and unlock experiences",
      icon: "/step4.svg",
      fallbackIcon: Calendar,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      step: 5,
      title: "Track & Manage Your Wallet",
      description: "View your balance, history, and coin flow in real time.",
      icon: "/step5.svg",
      fallbackIcon: BarChart3,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
    },
    {
      step: 6,
      title: "Admin & Backend",
      description: "Organizers can track transactions, create events, and reward participants easily.",
      icon: "/step6.svg",
      fallbackIcon: Settings,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="relative w-full px-6 py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.1) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
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
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-blue-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Get Started in
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              6 Simple Steps
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From wallet creation to campus-wide participation, discover how UniByte transforms your digital campus experience
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 rounded-full hidden lg:block"></div>

          <div className="space-y-20">
            {steps.map((step, index) => {
              const FallbackIcon = step.fallbackIcon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={step.step}
                  variants={stepVariants}
                  className={`flex items-center gap-12 lg:gap-20 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col lg:flex-row`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left max-w-lg`}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 group">
                      {/* Step Number */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${step.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <span className={`text-xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                          {step.step}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed text-lg mb-6">
                        {step.description}
                      </p>

                      {/* Learn More Link */}
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                        <span>Learn More</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Icon Section */}
                  <div className="relative flex-shrink-0 lg:order-none order-first">
                    <div className="relative w-40 h-40 lg:w-48 lg:h-48">
                      {/* Glowing Background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-3xl opacity-20 blur-2xl scale-110 group-hover:opacity-30 transition-all duration-500`}></div>
                      
                      {/* Main Icon Container */}
                      <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center group hover:scale-105 transition-all duration-500 overflow-hidden">
                        {/* Inner gradient background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        <img
                          className="relative z-10 w-20 h-20 lg:w-24 lg:h-24 object-contain filter drop-shadow-lg"
                          src={step.icon}
                          alt={`Step ${step.step}`}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <FallbackIcon 
                          className={`relative z-10 w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r ${step.color} bg-clip-text text-transparent hidden`}
                        />
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform rotate-45"></div>
                      </div>

                      {/* Connecting Line for Mobile */}
                      {index < steps.length - 1 && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-blue-200 to-purple-200 lg:hidden"></div>
                      )}

                      {/* Enhanced Step Number Badge */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-xl border-2 border-white">
                        {step.step}
                      </div>

                      {/* Floating Decorative Elements */}
                      <div className={`absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r ${step.color} rounded-full opacity-60 animate-pulse`}></div>
                      <div className={`absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-r ${step.color} rounded-full opacity-40 animate-pulse delay-300`}></div>
                    </div>
                  </div>

                  {/* Spacer for even layout */}
                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-gray-200/50">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-gray-700 font-medium">Ready to transform your campus experience?</span>
            <motion.button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TimeLine;