import React from "react";

export const Header = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          BrosChat
          <span className="text-xs ml-2 bg-emerald-900 px-2 py-1 rounded-full">
            SIGMA
          </span>
        </h1>
      </div>
    </div>
  );
};
