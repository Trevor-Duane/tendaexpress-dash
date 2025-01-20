import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css'; // Importing the CSS file

const UserManagement = () => {
  const [users, setUsers] = useState([]); // Stores all users
  const [selectedUser, setSelectedUser] = useState(null); // Stores the currently selected user
  const [name, setName] = useState(''); // Stores user name
  const [email, setEmail] = useState(''); // Stores user email
  const [role, setRole] = useState(''); // Stores user role
  const [loading, setLoading] = useState(false); // Loading state for updates
  const [error, setError] = useState(''); // Error messages

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data.data);
      } catch (err) {
        console.error('Error fetching users:', err.message);
        setError('Failed to fetch users.');
      }
    };
    fetchUsers();
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setName(user.username);
    setEmail(user.email);
    setRole(user.user_role); // Assuming `user_role` is the field for the role
  };

  // Handle form submission for updating user details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put('http://localhost:3000/auth/update_role', {
        id: selectedUser.id, // Pass the user ID
        username: name,
        email: email,
        user_role: role,
      });

      // Update user in the list
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, username: name, email: email, user_role: role }
            : user
        )
      );
    } catch (err) {
      console.error('Error updating user:', err.message);
      setError('Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <h2>User Management</h2>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* User List */}
      <div>
        <h3>All Users</h3>
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`${
                selectedUser?.id === user.id ? 'selected-user' : ''
              }`}
            >
              {user.username} ({user.email})
            </li>
          ))}
        </ul>
      </div>

      {/* User Form */}
      {selectedUser && (
        <div className="form-container">
          <h3>Edit User</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>
                Name:
                <input
                  type="text"
                  value={name || ''}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>
                User Level:
                <input
                  type="text"
                  value={role || ''}
                  onChange={(e) => setRole(e.target.value)}
                />
              </label>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>
                Email:
                <input
                  type="email"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
