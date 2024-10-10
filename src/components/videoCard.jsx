import { useContext, useState } from 'react';
import { IoIosOptions } from "react-icons/io";
import { BsMicMute, BsMic } from "react-icons/bs";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaBan } from "react-icons/fa";
import { SocketContext } from '../contextApi/Contexts/socket';
 
export default function VideoCard({ source, isControl }) {
    const Socket = useContext(SocketContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    
    const banUser = () => {
        Socket.emit("banUser", { userId: source.id }, () => {
            // console.log(room);
        });
    };

    const toggleMute = () => {
        if (source.feed.current) {
            source.feed.current.muted = !source.feed.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className={`w-1/3 rounded-xl overflow-hidden relative ${source.id === 0 ? 'hidden' : ''}`}>
            <span className='text-white text-md font-semibold absolute top-4 left-4 z-10 bg-black bg-opacity-50 p-2 rounded-xl'>{source.name}</span>
   
            <video 
                ref={source.feed}
                autoPlay
                muted={isMuted}
                className='w-full h-full object-cover rounded-xl'
            />
            
            <div className='absolute top-4 right-4 z-10'>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className='flex items-center hover:scale-105 transition-all duration-300 text-white rounded-full bg-[#0AA1DD] p-1 gap-2'
                >
                    <IoIosOptions size={24} />
                </button>
                {isMenuOpen && (
                    <div className='absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
                        <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
                        {isControl && (
                            <a href='#' className='flex items-center gap-2 px-4 py-2 text-sm text-[#dd230a] hover:bg-gray-100'   onClick={() =>banUser()}
                            role='menuitem'>
                            <FaBan size={20}   />
                                <span className='flex items-center gap-2'>Ban user</span>
                            </a>
                        )}                            
                            <a href='#'  className=' items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hidden' role='menuitem'>
                            <MdOutlinePrivacyTip size={20}   />
                                <span>
                                Private message
                                </span>
                            </a>

                            <a href='#' className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2' onClick={toggleMute} role='menuitem'>
                                {isMuted ? <BsMic size={20} /> : <BsMicMute size={20} />}
                                <span>{isMuted ? 'Unmute user' : 'Mute user'}</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    )
}