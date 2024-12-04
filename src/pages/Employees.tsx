import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, UserWithPassword } from '../types/auth';
import { UserPlus, Trash2, Key, Eye, EyeOff } from 'lucide-react';
import { getAllUsersWithPasswords, addUser, updateUserPassword, deleteUser } from '../utils/auth';

export default function Employees() {
  const { user: currentUser } = useAuthStore();
  const [employees, setEmployees] = useState<UserWithPassword[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allUsers = await getAllUsersWithPasswords();
        // Filter out admin users
        setEmployees(Array.isArray(allUsers) ? allUsers.filter(u => u.role === 'employee') : []);
      } catch (err) {
        setError('Failed to load employees. Please try again later.');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (currentUser?.role !== 'admin') {
    return <div className="p-4 text-center text-red-600">Access denied</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const employee = await addUser({
        ...newEmployee,
        role: 'employee',
      });
      setEmployees([...employees, { ...employee, password: newEmployee.password }]);
      setShowModal(false);
      setNewEmployee({ username: '', name: '', email: '', password: '' });
    } catch (err) {
      console.error('Error adding employee:', err);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const success = await deleteUser(id);
      if (success) {
        setEmployees(employees.filter((emp) => emp.id !== id));
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await updateUserPassword(selectedUserId, newPassword);
      if (success) {
        setEmployees(employees.map(emp => 
          emp.id === selectedUserId 
            ? { ...emp, password: newPassword }
            : emp
        ));
        setShowPasswordModal(false);
        setNewPassword('');
        setSelectedUserId('');
      }
    } catch (err) {
      console.error('Error updating password:', err);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Employees</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <UserPlus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">
                      {showPasswords[employee.id] ? employee.password : '••••••••'}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(employee.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords[employee.id] ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUserId(employee.id);
                        setShowPasswordModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Change Password"
                    >
                      <Key size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Employee"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={newEmployee.username}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, username: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setSelectedUserId('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}