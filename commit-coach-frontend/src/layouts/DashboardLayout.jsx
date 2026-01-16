import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">
        <h2 className="text-xl font-bold mb-8">Repo Analyzer</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="block hover:text-gray-400">Dashboard</Link>
          <Link to="/history" className="block hover:text-gray-400">History</Link>
          <Link to="/analytics" className="block hover:text-gray-400">Analytics</Link>
          <Link to="/profile" className="block hover:text-gray-400">Profile</Link>
          <button onClick={handleLogout} className="block text-red-400 hover:text-red-300">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;