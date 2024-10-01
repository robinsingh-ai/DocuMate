"use client";

import { Dispatch, SetStateAction, useState } from "react";

type InputSectionProps = {
  title: string;
  placeholder: string;
  data: string[];
  setData: Dispatch<SetStateAction<string[]>>;
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
    <div className="mb-6">
      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>{title}</h3>
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={`flex-grow p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
        />
        <button
          onClick={handleAddClick}
          className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded-r-lg transition duration-300 ease-in-out`}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}
          >
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{item}</span>
            <button
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}