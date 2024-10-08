import ControllePanle from '../components/controllePanle';
import MainVideoCard from '../components/mainVideoCard';
import ChatBox from '../components/chatBox';
import { useContext, useEffect, useState } from 'react';
import VideoCard from '../components/videoCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '../contextApi/Contexts/socket';
import { AppContext } from '../contextApi/Contexts/AppContext';
import { useMediaSoupHelper } from '../hooks/mediaSoupHelper';
import { useRoomManger } from '../hooks/roomMangerHelper';
import ErrorModel from '../components/ErrorModel';
import UsernameModal from '../components/UsernameModal';

export default function Meet() {
	const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
	const [hasNewMessage, setHasNewMessage] = useState(false);

	const handleNewMessage = () => {
		if (!isChatBoxOpen) {
			setHasNewMessage(true);
		}
	};

	const toggleChat = () => {
		setIsChatBoxOpen(!isChatBoxOpen);
		if (!isChatBoxOpen) {
			setHasNewMessage(false);
		}
	};

	const navigate = useNavigate();

	const { roomState  } = useContext(AppContext);

	const { userMediaTrack, adminId , guestList } = roomState;

	const { startStreming, Unmount } = useMediaSoupHelper();

	const { CreateOrJoinTheRoom ,handleUsernameSubmit, errorModel, showUsernameModal,setErrorModel } = useRoomManger(startStreming);

	const location = useLocation();

	const Socket = useContext(SocketContext);
	
	useEffect(() => {

		// console.log('%cMEET USE EFFECT', 'color: #00ff00; font-weight: bold; font-size: 16px;');

		if (
			(userMediaTrack || location?.state?.IsViewer) &&
			!adminId &&
			Socket.connected
		){
			CreateOrJoinTheRoom();
		}
		// console.log( (userMediaTrack || location?.state?.IsViewer), adminId, Socket === Socket)
	//   CreateOrJoinTheRoom();
	//return () => Unmount();
	
	}, [userMediaTrack, adminId, Socket]);

	useEffect(() => {
		return () => Unmount();
	}, []);

	return (
		<>
			{errorModel && (
				<ErrorModel
					message={errorModel}
					onClose={() => {
						navigate('/');
					}}
				/>
			)}
			
			<ControllePanle isChatBoxOpen={isChatBoxOpen}   hasNewMessage={hasNewMessage} setIsChatBoxOpen={toggleChat} /> 
			<div className='flex flex-col md:flex-row w-full'>

				<div className='w-full '>
					<div className='flex  flex-col xl:flex-row justify-center items-center gap-5 p-2' > 
						<VideoCard   source={guestList[1]} isControl={Socket.id == adminId}  />
						<VideoCard   source={guestList[2]}  isControl={Socket.id == adminId} />
						<VideoCard   source={guestList[3]}  isControl={Socket.id == adminId} />
					</div>
					<div className='flex  p-2 ' >
						<MainVideoCard  />
					</div>
				
				</div>
				<ChatBox isOpen={isChatBoxOpen}  handleNewMessage={handleNewMessage}   />

			</div>

			{showUsernameModal && (
				<UsernameModal onSubmit={handleUsernameSubmit} />
			)}
			
		 
			
		</>
	);
}