import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FcHome, FcWebcam } from "react-icons/fc";
// ... existing Header component code ...   
import Model from './Model';
import { SocketContext } from "../contextApi/Contexts/socket";

export default function Header() {

  const [isModelOpen, setIsModelOpen] = useState(false);
  const Socket = useContext(SocketContext);
  const navigate = useNavigate();

  const goToLobby = () => {
    // Disconnect the socket
    
    // Navigate to the root (lobby)
    navigate('/');
  };

  return (
    <header className="mt-5 rounded-lg p-2 border border-gray-300 bg-gradient-to-r from-[#BBECFF] via-[#33CCFF] to-[#0D7C66] flex justify-between items-center">
      <div className="flex items-center gap-1">
        <img src={logo} alt="logo" className="w-26 h-14" />
        <h1 className="text-2xl text-white bor font-bold">wemet</h1>
      </div>
      <div className="flex items-center gap-4 mx-3">
        <button
          onClick={() => setIsModelOpen(!isModelOpen)}
          className="bg-white p-2 bg-opacity-20 text-white hover:bg-opacity-10 transition-all flex items-center gap-2 rounded-lg"
        >
          <span>Start Room</span>
          <FcWebcam size={24} />
        </button>
        <button 
          onClick={goToLobby}
          className="bg-white bg-opacity-20 text-white hover:bg-opacity-10 transition-all p-2 flex items-center gap-2 rounded-lg"
        >
          <span>Lobby</span>
          <FcHome size={24} />
        </button>
      </div>
      <Model
        isOpen={isModelOpen}
        setIsModelOpen={setIsModelOpen}
      //  onSubmit={handleCreateRoom}
      />
    </header>
  );
}