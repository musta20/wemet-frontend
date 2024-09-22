import { useState, useContext, useMemo } from 'react';
import { FaUsers } from "react-icons/fa";
import { GiSettingsKnobs } from "react-icons/gi";
import { BiHide } from "react-icons/bi";
import { MdPublic } from "react-icons/md";
import { IoMdUnlock } from "react-icons/io";
import { BiMessageSquareDetail } from "react-icons/bi";

import SwitchToggle from "./switchToogle";
import { SocketContext } from '../contextApi/Contexts/socket';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contextApi/Contexts/AppContext';
import { HiddeTheRoom, isRoomPublic, isRoomStream } from '../contextApi/Actions/roomHelperAction';

export default function ControllePanle({isChatBoxOpen, setIsChatBoxOpen}) {
  
  const [showSettings, setShowSettings] = useState(false);


  
  const { roomState, roomDispatch } =
    useContext(AppContext);
  const Socket = useContext(SocketContext);

  const { isRoomLock, roomName, guestList, isStreamed, adminId, isPublic, isFreeToJoin } =
    roomState;

 
  // Calculate the number of active guests (id != 0)
  const activeGuestsCount = useMemo(() => {
    return guestList.filter(guest => guest.id !== 0).length;
  }, [guestList]);

  const LockRoom = (check) => {
    Socket.emit('LockTheRoom', check, data => { })
    HiddeTheRoom( check,roomDispatch)

  };

  const doHiddeTheRoom = (check) => {
    Socket.emit('HiddeTheRoom', check, data => { })  
    isRoomPublic(check, roomDispatch);
  };

  const isStream = (check) => {
    isRoomStream(check,roomDispatch)
    Socket.emit('isStream', check, data => { })
  };

 
  // Check if the current user is the admin
  if (Socket.id !== adminId) {
    return (
      <div className="flex my-2 items-center justify-between">
      <div className="flex text-[#69696F] items-center rounded-xl border border-[#dddddd] bg-white p-1 gap-5">
        <FaUsers size={24} className='mx-2' />
        <span className="text-xl font-bold">{roomName}</span>
        <span className="p-3 rounded-xl bg-[#AEE8FF] font-bold">{activeGuestsCount}</span>
      </div>
      <div className='flex gap-5' >
      <button onClick={() => setIsChatBoxOpen(!isChatBoxOpen)} className="flex text-[#69696F]  hover:bg-gray-100 items-center rounded-xl border border-[#dddddd] bg-white p-4 gap-5">
          <BiMessageSquareDetail size={24} />
        </button>
      </div>
      </div>
    ); // Don't render anything if the user is not the admin
  }

  return (
    <div className="flex my-2 items-center justify-between">
      <div className="flex text-[#69696F] items-center rounded-xl border border-[#dddddd] bg-white p-1 gap-5">
        <FaUsers size={24} className='mx-2' />
        <span className="text-xl font-bold">{roomName}</span>
        <span className="p-3 rounded-xl bg-[#AEE8FF] font-bold">{activeGuestsCount}</span>
      </div>
    <div className='flex gap-5' >
      <div className="flex text-[#69696F] items-center rounded-xl border border-[#dddddd] bg-white p-2 gap-5">
        <div className={`flex gap-5 overflow-hidden transition-all duration-300 ease-in-out ${showSettings ? 'max-w-[1000px] opacity-100' : 'max-w-0 opacity-0'}`}>
          <div className="flex text-[#69696F] items-center rounded-xl border border-[#dddddd] bg-white p-2 gap-5 whitespace-nowrap">
            <BiHide size={24} />
            <span className="text-md font-bold">Private room</span>
            <SwitchToggle 
             setIsToggled={LockRoom}
             isToggled={isRoomLock}
            />
          </div>

          <div className="flex text-[#69696F] items-center rounded-xl border border-[#dddddd] bg-white p-2 gap-5 whitespace-nowrap">
            <MdPublic size={24} />
            <span className="text-md font-bold">Public</span>
            <SwitchToggle
                       setIsToggled={doHiddeTheRoom}
                       isToggled={isPublic}
            />
          </div>

          <div className="flex text-[#69696F] items-center rounded-xl border border-[#dddddd] bg-white p-2 gap-5 whitespace-nowrap">
            <IoMdUnlock size={24} />
            <span className="text-md font-bold">Lock the room</span>
            <SwitchToggle
                setIsToggled={(e) => isStream(e)}
                isToggled={isStreamed}
            />
          </div>
        </div>
        <button 
          className="flex hover:bg-gray-100 text-[#69696F] items-center rounded-xl border border-[#dddddd] bg-white p-2 gap-5"
          onClick={() => setShowSettings(!showSettings)}
        >
          <GiSettingsKnobs size={24} />
        </button>
      </div>
      <button onClick={() => setIsChatBoxOpen(!isChatBoxOpen)} className="flex text-[#69696F]  hover:bg-gray-100 items-center rounded-xl border border-[#dddddd] bg-white p-4 gap-5">
          <BiMessageSquareDetail size={24} />
        </button>
      </div>
    </div>
  );
}