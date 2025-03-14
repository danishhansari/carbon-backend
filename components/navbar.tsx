"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main navbar */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2"
            : "bg-white py-3"
        } fixed top-0 left-0 lg:px-12 w-full z-50 transition-all duration-300`}
        style={{ top: scrolled ? "0" : "32px" }}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              <span className="text-red-600">Royal</span>
              <span className="text-gray-800 hidden sm:inline">
                {" "}
                Manufacturing
              </span>
            </motion.div>
          </div>

          {/* Search Bar (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-1 mx-12 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className={`w-full px-4 py-2 border ${
                  searchFocused
                    ? "border-red-500 ring-2 ring-red-100"
                    : "border-gray-200"
                } rounded-full focus:outline-none transition-all duration-200 bg-gray-50`}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <Search
                className={`absolute top-2.5 right-3 ${
                  searchFocused ? "text-red-500" : "text-gray-400"
                } transition-colors duration-200`}
                size={18}
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Main Navigation */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-700 font-medium hover:text-red-600 transition-colors duration-200"
              >
                Home
              </a>

              {/* Products Dropdown */}
              <div className="group relative">
                <button className="text-gray-700 font-medium flex items-center gap-1 hover:text-red-600 transition-colors duration-200 group">
                  Products
                  <ChevronDown
                    size={16}
                    className="group-hover:rotate-180 transition-transform duration-300"
                  />
                </button>
                <div className="absolute left-0 mt-2 w-64 bg-white shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 z-50 transform origin-top scale-95 group-hover:scale-100">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                      CATEGORIES
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2.5 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-150 text-gray-700"
                    >
                      Industrial Machinery
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2.5 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-150 text-gray-700"
                    >
                      Manufacturing Tools
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2.5 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-150 text-gray-700"
                    >
                      Automation Systems
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2.5 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-150 text-gray-700"
                    >
                      Spare Parts
                    </a>
                  </div>
                </div>
              </div>

              <a
                href="#"
                className="text-gray-700 font-medium hover:text-red-600 transition-colors duration-200"
              >
                Solutions
              </a>

              <a
                href="#"
                className="text-gray-700 font-medium hover:text-red-600 transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-red-600 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
              {/* Mobile Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-red-500 bg-gray-50"
                  />
                  <Search
                    className="absolute top-2.5 right-3 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              <ul className="flex flex-col py-2">
                <li className="border-b border-gray-100">
                  <a
                    href="#"
                    className="block px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                  >
                    Home
                  </a>
                </li>
                <li className="border-b border-gray-100">
                  <button className="w-full text-left px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 font-medium flex items-center justify-between">
                    Products
                    <ChevronDown size={16} />
                  </button>
                  <div className="bg-gray-50 px-6 py-2">
                    <ul>
                      <li className="py-2 text-gray-700 hover:text-red-600">
                        <a href="#">Industrial Machinery</a>
                      </li>
                      <li className="py-2 text-gray-700 hover:text-red-600">
                        <a href="#">Manufacturing Tools</a>
                      </li>
                      <li className="py-2 text-gray-700 hover:text-red-600">
                        <a href="#">Automation Systems</a>
                      </li>
                      <li className="py-2 text-gray-700 hover:text-red-600">
                        <a href="#">Spare Parts</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="border-b border-gray-100">
                  <a
                    href="#"
                    className="block px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                  >
                    Solutions
                  </a>
                </li>
                <li className="border-b border-gray-100">
                  <a
                    href="#"
                    className="block px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
