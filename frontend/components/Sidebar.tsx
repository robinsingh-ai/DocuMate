"use client";

import React from "react";
import InputSection from "@/components/InputSection";
import { useCrewOutput } from "@/hooks/useCrewOutput";
import ResearchResults from "@/components/ResearchResults";
import EventLog from "@/components/EventLog";
import { X } from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, isOpen, onClose }) => {
  const crewOutput = useCrewOutput();

  return (
    <div className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
      
      
        <button onClick={onClose} className="lg:hidden">
          <X className="w-5 h-5" />
        </button>
      
      <div className="p-4 space-y-6">
        <InputSection
          title="Technologies"
          placeholder="Example: Generative AI"
          data={crewOutput.technologies}
          setData={crewOutput.setTechnologies}
          darkMode={darkMode}
        />
        <InputSection
          title="Business Areas"
          placeholder="Example: Customer Service"
          data={crewOutput.businessareas}
          setData={crewOutput.setBusinessareas}
          darkMode={darkMode}
        />
        <button
          onClick={() => crewOutput.startOutput()}
          className={`w-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
          disabled={crewOutput.running}
        >
          {crewOutput.running ? "Running..." : "Start Research"}
        </button>
        <ResearchResults darkMode={darkMode} />
        <EventLog events={crewOutput.events} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Sidebar;