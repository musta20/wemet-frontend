import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsernameModal = ({ onSubmit }) => {

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();
    
    // Username validation
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      setError('Username must be between 3 and 20 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setError('');
    onSubmit(trimmedUsername);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ">
      <div className="bg-[#F1F7F9] rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#055777] ">Enter Your Username</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Your username"
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className='flex gap-5'>
            <a
              onClick={() => navigate('/')}
              className="w-full bg-[#df4a4a] hover:bg-[#ca7a6f] text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="w-full bg-[#055777] hover:bg-[#6fb0ca] text-white font-bold py-2 px-4 rounded"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;