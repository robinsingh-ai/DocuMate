import React from "react";
import { EventType } from "@/hooks/useCrewOutput";

type EventLogProps = {
  events: EventType[];
  darkMode: boolean;
};

export const EventLog: React.FC<EventLogProps> = ({ events, darkMode }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Event Log</h2>
      <div className={`flex-grow overflow-auto border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} rounded-lg p-4`}>
        {events.length === 0 ? (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>No events yet.</p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{event.timestamp}:</span>
              <span className={`ml-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{event.data}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventLog;