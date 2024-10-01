"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PDFChat from "@/components/PDF_chat";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} toggleSidebar={toggleSidebar} />
      
      <div className="flex pt-16"> {/* Added pt-16 for navbar space */}
        {sidebarOpen && (
          <Sidebar darkMode={darkMode} isOpen={sidebarOpen} onClose={toggleSidebar} />
        )}
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-6 mb-6`}>
              <h2 className="text-2xl font-bold mb-4">Chat with PDFs</h2>
              <div className="h-[calc(100vh-200px)]">
                <PDFChat darkMode={darkMode} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}