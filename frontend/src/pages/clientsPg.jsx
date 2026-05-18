import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/images/bgImage3.jpg';
import axios from 'axios';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(Array.isArray(response.data) ? response.data : []);
      setMessage('');
    } catch (err) {
      setMessage('Failed to fetch clients.');
      console.error('Fetch clients error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/clients', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Client created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', email: '' });
      fetchClients();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to create client');
      console.error('Create client error:', err);
    }
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (!editingClient?.id) return;

    try {
      await axios.put(`http://localhost:8080/clients/${editingClient.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Client updated successfully!');
      setEditingClient(null);
      setFormData({ name: '', email: '' });
      fetchClients();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to update client');
      console.error('Update client error:', err);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      await axios.delete(`http://localhost:8080/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Client deleted successfully!');
      fetchClients();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to delete client');
      console.error('Delete client error:', err);
    }
  };

  const startEditClient = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
    });
    setShowCreateForm(false);
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingClient(null);
    setFormData({ name: '', email: '' });
    setMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading clients...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 py-12 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundImage})`,
      }}
    >
      <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-8 drop-shadow-lg">
        Clients Dashboard
      </h2>

      <div className="w-full max-w-6xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Client Management</h3>
        {/* Message Display */}
        {message && (
          <p
            className={`text-center mb-4 font-medium ${
              message.includes('successfully') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        {/* Create Button */}
        <div className="text-left mb-6">
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingClient(null);
              setFormData({ name: '', email: '' });
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            + Create New Client
          </button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingClient) && (
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">
              {editingClient ? 'Edit Client' : 'Create New Client'}
            </h3>
            <form onSubmit={editingClient ? handleUpdateClient : handleCreateClient}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingClient ? 'Update Client' : 'Create Client'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Clients List */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <p className="font-semibold text-lg text-gray-800 mb-2">{client.name}</p>
              <p className="text-gray-600 mb-1">
                <strong>Email:</strong> {client.email}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Owner:</strong> {client.owner.username || 'Unknown'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditClient(client)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Modify
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4">No clients found</p>
        )}
      </div>
    </div>
  );
}

export default ClientsPage;