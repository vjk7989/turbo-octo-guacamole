import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/employees"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <Users size={20} />
                <span>Manage Employees</span>
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}