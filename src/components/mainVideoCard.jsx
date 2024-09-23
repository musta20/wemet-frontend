import video from '../assets/_Wife_ Amy Rose.mp4';
import { ImPhoneHangUp } from "react-icons/im";
import { BsMicMute, BsMic } from "react-icons/bs";
import { FaVideoSlash, FaVideo } from "react-icons/fa";
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../contextApi/Contexts/AppContext';
import { SocketContext } from '../contextApi/Contexts/socket';
import { useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { IoIosOptions } from "react-icons/io";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaBan } from "react-icons/fa";

export default function MainVideoCard() {

  const CanvasImg = useRef(null);
  
  const [isPlay,setIsPlay]=useState(false)
  
  const [isMuted, setIsMuted] = useState(false);
  
  const [isCameraOff, setIsCameraOff] = useState(false);
  
  const Socket = useContext(SocketContext);

  const { roomState } = useContext(AppContext);

  const { adminId, userMediaTrack, guestList } = roomState;

  const [userName,setUserName] = useState('');
 
  const navigate = useNavigate();

  //this function take small imge from the user video
  // and send it to the server as a thumnail imge
  const TakeThumbnailImage = () => {

  
    if (Socket.id !== adminId || !isPlay) return;

    let context = CanvasImg.current.getContext("2d");

    context.drawImage(guestList[0].feed.current, 0, 0, 280, 200);

    let data = CanvasImg.current.toDataURL("image/png", 0.1);

    Socket.volatile.emit("saveimg", data, (data) => {
    //  console.log(data)
    });

    // Clear the canvas after drawing the image
  };

  useEffect(() => {
 
    if (userMediaTrack && !guestList[0].feed.current.srcObject)
      {
        guestList[0].feed.current.srcObject = userMediaTrack;
      
      }


      //return ()=>guestList[0].feed.current.srcObject = null;

  }, [userMediaTrack,guestList]);

  useEffect(() => {
    //console.log('%cTakeThumbnailImage USE EFFECT', 'color: #00ff00; font-weight: bold; font-size: 16px;');

    TakeThumbnailImage()

    // return ()=>{    
    //   context.clearRect(0, 0, CanvasImg.current.width, CanvasImg.current.height);
    
    // }

  }, [adminId , isPlay, TakeThumbnailImage]);

  const handleEndCall = () => {
    // Add any cleanup logic here (e.g., closing video streams, leaving the room, etc.)
    // Then navigate to the main page
    navigate('/');
  };

  const toggleMic = () => {
    if (userMediaTrack) {
      const audioTracks = userMediaTrack.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (userMediaTrack) {
      const videoTracks = userMediaTrack.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
      
      // Mute/unmute the video element
      if (guestList[0].feed.current) {
        guestList[0].feed.current.muted = !isCameraOff;
      }
    }
  };

  return (
    <>
      <canvas
        ref={CanvasImg}
        style={{ display: "none" }}
        width="280"
        height="200"
        id="canvas"
      ></canvas>
    
    
    <div className={`w-full h-[40rem] rounded-xl overflow-hidden relative  bg-black`}>
      <span className='text-white text-2xl font-bold absolute top-4 left-4 z-10 bg-black bg-opacity-50 p-2 rounded-xl'>{guestList[0].name}</span>


      <video 
       
        ref={guestList[0].feed}
       onPlay={()=>setIsPlay(true)}

      autoPlay muted={isCameraOff} className='w-full h-full object-cover rounded-xl' />

    {Socket.id == guestList[0].id && (
      <div className='absolute bottom-0 left-0 w-full h-1/6 bg-black bg-opacity-50'>
        <div className='flex mx-auto place-content-center gap-5 p-5'>
        <button   onClick={toggleCamera}

        className={`flex items-center hover:scale-105 transition-all duration-300 text-white rounded-full ${isCameraOff ? 'bg-[#055777]' : 'bg-[#055777] bg-opacity-50'} p-3 gap-2`}
                >
                {isCameraOff ? <FaVideoSlash size={24}   /> : <FaVideo size={24} />}
             </button>

            <button 
              onClick={handleEndCall}
              className='flex items-center hover:scale-105 transition-all duration-300 bg-[#f56060] text-white rounded-lg p-2 gap-2'
            >
              <ImPhoneHangUp size={24}  
                
                />
                <span className='text-white text-xl font-bold'>End Call</span>
            </button>

            <button 
              onClick={toggleMic}
              className={`flex items-center hover:scale-105 transition-all duration-300 text-white rounded-full ${isMuted ? 'bg-[#055777]' : 'bg-white bg-opacity-50'} p-3 gap-2`}
            >
              {isMuted ? <BsMicMute size={24} /> : <BsMic size={24} />}
            </button>
        </div>
      </div> )}
    </div>
    </>
  );
}