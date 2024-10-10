import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FcHome, FcWebcam } from "react-icons/fc";
// ... existing Header component code ...   
import Model from './Model';
//import { SocketContext } from "../contextApi/Contexts/socket";

export default function Header() {

  const [isModelOpen, setIsModelOpen] = useState(false);
  //const Socket = useContext(SocketContext);
  const navigate = useNavigate();

  const goToLobby = () => {
    // Disconnect the socket
    // Navigate to the root (lobby)
    navigate('/');
  };

  return (
    <header className="mt-5 rounded-lg p-2 border border-gray-300 bg-gradient-to-r from-[#BBECFF] via-[#33CCFF] to-[#0D7C66] flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center gap-1 mb-4 sm:mb-0">
        <img src={logo} alt="logo" className="w-20 h-10 sm:w-26 sm:h-14" />
        <h1 className="text-xl sm:text-2xl text-white font-bold">wemet</h1>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mx-3">
        <button
          onClick={() => setIsModelOpen(!isModelOpen)}
          className="w-full sm:w-auto bg-white p-2 bg-opacity-20 text-white hover:bg-opacity-10 transition-all flex items-center justify-center gap-2 rounded-lg mb-2 sm:mb-0"
        >
          <span>Start Room</span>
          <FcWebcam size={24} />
        </button>
        <button 
          onClick={goToLobby}
          className="w-full sm:w-auto bg-white bg-opacity-20 text-white hover:bg-opacity-10 transition-all p-2 flex items-center justify-center gap-2 rounded-lg"
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