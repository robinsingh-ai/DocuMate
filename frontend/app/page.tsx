"use client";

import { useState } from "react";
import { EventLog } from "@/components/EventLog";
import InputSection from "@/components/InputSection";
import { useCrewOutput } from "@/hooks/useCrewOutput";
import PDFUpload from "../components/PDF_upload";
import PDFChat from "../components/PDF_chat";
import ResearchResults from "@/components/ResearchResults";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Home() {
  const crewOutput = useCrewOutput();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Sidebar */}
      <div className={`w-1/4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>Input</h2>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
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
        <PDFUpload darkMode={darkMode} />
        <button
          onClick={() => crewOutput.startOutput()}
          className={`w-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mt-6`}
          disabled={crewOutput.running}
        >
          {crewOutput.running ? "Running..." : "Start Research"}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Chat-like interface */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6 flex-grow overflow-y-auto`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Chat with PDFs
          </h2>
          <div className="space-y-4">
            <PDFChat darkMode={darkMode} />
          </div>
        </div>

        {/* Results section */}
        <ResearchResults darkMode={darkMode} />

        {/* Event log */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <EventLog events={crewOutput.events} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}