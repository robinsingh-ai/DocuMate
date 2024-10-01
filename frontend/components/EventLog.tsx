"use client";

import React from "react";
import { EventType } from "@/hooks/useCrewOutput";

type EventLogProps = {
  events: EventType[];
  darkMode: boolean;
};

export const EventLog: React.FC<EventLogProps> = ({ events, darkMode }) => {
  return (
    <div className="flex flex-col">
      <h2 className={`text-base font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Event Log</h2>
      <div className={`overflow-auto border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} rounded p-2 max-h-40`}>
        {events.length === 0 ? (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic text-xs`}>No events yet.</p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="mb-1 last:mb-0 text-xs">
              <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{event.timestamp}:</span>
              <span className={`ml-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{event.data}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventLog;