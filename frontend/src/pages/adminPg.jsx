import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/images/bgImage3.jpg';
import axios from 'axios';
import { useAuth } from '../hooks/UseAuth';


function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const { username } = useAuth();
  const token = localStorage.getItem('jwtToken');

  const UNDEMOTABLE_USERNAMES = ['superadmin', 'founder'];
  // const PROTECTED_EMAILS = ['superadmin@email.com', 'founder@email.com'];

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setMessage('Access denied or token invalid.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const promoteUser = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/admin/promote/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ User promoted to admin');
      fetchUsers();
    } catch (err) {
      setMessage('❌ Failed to promote user');
      console.error(err);
    }
  };

  const demoteUser = async (userId, targetUsername) => {

    if (UNDEMOTABLE_USERNAMES.includes(targetUsername)) {
      setMessage("❌ This user is protected from demotion.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/admin/demote/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('⚠️ User demoted to regular user');
      fetchUsers();
    } catch (err) {
      setMessage('❌ Failed to demote user');
      console.error(err);
    }
  };

  const deleteUser = async (userId, targetUsername, targetEmail) => {

    if (UNDEMOTABLE_USERNAMES.includes(targetUsername)) {
      setMessage("❌ This user is protected from deletion.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user ${targetEmail || targetUsername}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ User deleted successfully');
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data || err.message;
      console.error('Delete error:', err);

      if (err.response?.status === 403) {
        setMessage('❌ Access denied - Admin privileges required');
      } else if (err.response?.status === 404) {
        setMessage('❌ User not found');
      } else {
        setMessage(`❌ Failed to delete user: ${errorMessage}`);
      }
    }
  };

  return (
    <div
      className="min-h-screen px-6 py-12 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundImage})`,
      }}
    >
      <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-8 drop-shadow-lg">
        Admin Dashboard
      </h2>

      <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        {message && (
          <p className="text-red-500 text-center mb-4 font-medium">{message}</p>
        )}

        <h3 className="text-xl font-semibold text-gray-800 mb-6">User Management</h3>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {users.map((user) => {
            const isSelf = user.username === username;
            const isProtected = UNDEMOTABLE_USERNAMES.includes(user.username);

            return (
              <div key={user.id} className="bg-white p-6 rounded-lg shadow-md">
                <p className="font-semibold text-lg text-gray-800">
                  {user.name || user.username || 'Unnamed User'}
                </p>
                <p className="text-gray-600 mt-2">{user.email}</p>
                <p className="text-gray-600 mt-2">Role: {user.role}</p>

                {user.role !== 'ADMIN' && (
                  <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => promoteUser(user.id)}
                  >
                    Promote to Admin
                  </button>
                )}

                {user.role === 'ADMIN' && (
                  <button
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={isSelf || isProtected}
                    onClick={() => demoteUser(user.id, user.username)}
                  >
                    Demote to User
                  </button>
                )}

                <button
                  onClick={() => deleteUser(user.id, user.username, user.email)}
                  disabled={isSelf || isProtected}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Delete User
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;