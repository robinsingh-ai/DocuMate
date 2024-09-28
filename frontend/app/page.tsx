"use client";

import { EventLog } from "@/components/EventLog";
import InputSection from "@/components/InputSection";
import { useCrewOutput } from "@/hooks/useCrewOutput";
import PDFUpload from "../components/PDF_upload";
import PDFChat from "../components/PDF_chat";
import ResearchResults from "@/components/ResearchResults";

export default function Home() {
  const crewOutput = useCrewOutput();

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Input</h2>
        <InputSection
          title="Technologies"
          placeholder="Example: Generative AI"
          data={crewOutput.technologies}
          setData={crewOutput.setTechnologies}
        />
        <InputSection
          title="Business Areas"
          placeholder="Example: Customer Service"
          data={crewOutput.businessareas}
          setData={crewOutput.setBusinessareas}
        />
        <PDFUpload />
        <button
          onClick={() => crewOutput.startOutput()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mt-6"
          disabled={crewOutput.running}
        >
          {crewOutput.running ? "Running..." : "Start Research"}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Chat-like interface */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex-grow overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Chat with PDFs
          </h2>
          <div className="space-y-4">
            <PDFChat />
          </div>
        </div>

        {/* Results section */}
          {/* ... existing code ... */}

          {/* Results section */}
          <ResearchResults />

        {/* Event log */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <EventLog events={crewOutput.events} />
        </div>
      </div>
    </div>
  );
}
