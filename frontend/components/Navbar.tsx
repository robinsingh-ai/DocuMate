"use client";

import React, { useState, useEffect } from "react";
import { Menu, BookOpen } from 'lucide-react';
import DarkModeToggle from "@/components/DarkModeToggle";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? `${darkMode ? 'bg-gray-900/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'} shadow-md`
        : `${darkMode ? 'bg-gray-800' : 'bg-white'}`
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className={`mr-4 ${darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'} focus:outline-none transition-colors duration-200`}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className={`flex items-center ${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-lg`}>
            <BookOpen className="h-6 w-6 mr-2" />
            Documate
          </div>
        </div>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </header>
  );
};

export default Navbar;