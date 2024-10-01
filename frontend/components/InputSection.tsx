"use client";

import React, { useState } from "react";
import { Plus, X } from 'lucide-react';

type InputSectionProps = {
  title: string;
  placeholder: string;
  data: string[];
  setData: React.Dispatch<React.SetStateAction<string[]>>;
  darkMode: boolean;
};

export default function InputSection({
  title,
  placeholder,
  setData,
  data,
  darkMode,
}: InputSectionProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddClick = () => {
    if (inputValue.trim() !== "") {
      setData((prevItems) => [...prevItems, inputValue]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{title}</h3>
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={`flex-grow text-sm p-1 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-l focus:outline-none focus:ring-1 focus:ring-blue-400`}
        />
        <button
          onClick={handleAddClick}
          className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white p-1 rounded-r transition duration-150 ease-in-out`}
        >
          <Plus size={16} />
        </button>
      </div>
      <ul className="space-y-1 max-h-32 overflow-y-auto">
        {data.map((item, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-1 text-sm ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded`}
          >
            <span className="truncate flex-grow mr-2">{item}</span>
            <button
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}