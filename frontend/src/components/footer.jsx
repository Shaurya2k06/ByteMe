import React from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Github, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Heart
} from "lucide-react";

function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src="/navbarLogo.svg"
                  alt="UniByte Logo"
                  className="w-16 h-16 md:w-20 md:h-20"
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  UniByte
                </h1>
                <p className="text-gray-400 text-sm mt-1">Digital Campus Ecosystem</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-lg">
              Your campus's digital wallet and event hub — earn, spend, and explore with tokens built for student life.
            </p>

            {/* Newsletter Signup */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">Get the latest updates on features and events</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 group">
                  Subscribe
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <div className="space-y-4">
              {[
                { to: "/", label: "Home" },
                { to: "/login", label: "Login" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/events", label: "Events" },
                { to: "/marketplace", label: "Marketplace" },
                { to: "/about", label: "About" }
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="block text-gray-300 hover:text-white transition-colors duration-300 group flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">+91 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">support@unibyte.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <MapPin className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">Campus Hub, University District</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { Icon: Twitter, color: "hover:bg-blue-500", href: "#" },
                  { Icon: Instagram, color: "hover:bg-pink-500", href: "#" },
                  { Icon: Linkedin, color: "hover:bg-blue-600", href: "#" },
                  { Icon: Github, color: "hover:bg-gray-600", href: "#" }
                ].map(({ Icon, color, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    className={`p-3 bg-white/10 rounded-xl hover:scale-110 transition-all duration-300 border border-white/20 ${color} group`}
                  >
                    <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <p>&copy; 2025 UniByte. All rights reserved.</p>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <span>•</span>
                <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>by Team ByteMe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </footer>
  );
}

export default Footer;