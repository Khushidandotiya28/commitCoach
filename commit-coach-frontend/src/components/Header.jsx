import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-indigo-600">
        Commit Coach
      </h2>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            {user.name}
          </span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
