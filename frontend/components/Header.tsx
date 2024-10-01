import React from 'react';

interface HeaderProps {
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-black'}`}>
      <div className="mx-auto py-4 px-5">
        <h1 className="text-white text-xl font-bold">
          Documate
        </h1>
      </div>
    </div>
  );
};

export default Header;