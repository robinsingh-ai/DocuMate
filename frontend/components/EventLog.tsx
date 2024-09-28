import React from "react";
import { EventType } from "@/hooks/useCrewOutput";

type EventLogProps = {
  events: EventType[];
};

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Event Log</h2>
      <div className="flex-grow overflow-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
        {events.length === 0 ? (
          <p className="text-gray-500 italic">No events yet.</p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <span className="text-sm font-semibold text-gray-600">{event.timestamp}:</span>
              <span className="ml-2 text-gray-800">{event.data}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};