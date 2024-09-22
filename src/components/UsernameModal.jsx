import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsernameModal = ({ onSubmit }) => {

  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();
    
    if (username.trim()) {

      onSubmit(username.trim());

    }

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
          <div className='flex gap-5'>

          <a
            
            onClick={()=>{
               navigate('/')
            }}
            className="w-full  bg-[#df4a4a]  hover:bg-[#ca7a6f] text-white font-bold py-2 px-4 rounded"
          >
            cancel
          </a>



          <button
            type="submit"
            className="w-full  bg-[#055777]  hover:bg-[#6fb0ca] text-white font-bold py-2 px-4 rounded"
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