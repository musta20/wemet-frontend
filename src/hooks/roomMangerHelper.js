import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { AppContext } from "../../src/contextApi/Contexts/AppContext";
import { setParam } from "../../src/contextApi/Actions/mediaSoupAction";
import {
  setIsAudience,
  isRoomPublic,
  isRoomStream,
  upDateGuestList,
  setRoomName,
  setAdminId,
  setIsFreeToJoin,
  setUserMedia,
} from "../../src/contextApi/Actions/roomHelperAction";
import { SocketContext } from "../../src/contextApi/Contexts/socket";
import { toast } from 'react-toastify'; 

export const useRoomManger = (startStreming) => {
	const [errorModel, setErrorModel] = useState(null);
	const [showUsernameModal, setShowUsernameModal] = useState(false);
	const [username, setUsername] = useState('');

	const navigate = useLocation();
	const { mediaSoupstate, mediaSoupDispatch, roomState, roomDispatch } = useContext(AppContext);
	const { guestList } = roomState;
	const { params } = mediaSoupstate;
	const Socket = useContext(SocketContext);
	const { Room } = useParams();

	useEffect(() => {
		//console.log('%cROOM MANGGER USE EFFECT', 'color: #00ff00; font-weight: bold; font-size: 16px;');

		setRoomName(Room, roomDispatch);
		if(!navigate?.state?.userName && !navigate?.state?.IsViewer )
		{
			setShowUsernameModal(true);

		}
		if (Socket && !navigate?.state?.IsViewer && navigate?.state?.userName) {
 			StartUserCamra(navigate?.state?.userName);
		}

		// return ()=>{
		// 	setRoomName(null, roomDispatch);
		// }

	}, []);

	const handleUsernameSubmit = (name) => {
		setUsername(name);
		setShowUsernameModal(false);
		if (Socket && !navigate?.state?.IsViewer) {
			StartUserCamra(name);
		}
	};

	//this function will show the notftion
	const showTost = (data, status) => {

		switch (status) {
			case "info":
				toast.info(data)
				break;
			case "success":
				toast.success(data)
				break;
			case "warning":
				toast.warning(data)
				break;
			case "error":
				toast.error(data)
				break;
			default:
				break;
		}
	};

	const showErrorModel = (message) => {
		setErrorModel(message);
	};

	/*
	this function is gone take the room name that 
	passed in the param and send it to the server 
	if you pass is viewer as true that mean you just 
	gone watch the stream. else if the room exist try to join it 
	if not create it and you will receive the first as true
	and set you as the room admin .
	if the room is full you just gone watch ti
	---------------------------------------------------------
	upon receiving the rtpCapabilities create a device 
	if viewer set as true will not  create send transport 
	and just receive any new producer from the server send 
	*/

	const CreateOrJoinTheRoom = () => {
		let IsPublic = true;
		let IsViewer = false;

		if (navigate?.state?.IsViewer) {

			setIsAudience(true, roomDispatch);
			IsViewer = true;
			
		}

		if (!navigate?.state?.IsPublic) {
			isRoomPublic(false, roomDispatch);
			IsPublic = false;
		}

		const userName = navigate?.state?.userName || guestList[0].name;

		//create room name it this way to add mor info in in the room name
		const FullRoomName = {
			title: Room,
			userName: userName,
			IsPublic: IsPublic,
			IsViewer: IsViewer,
		};


		Socket.emit(
			"CreateStream",
			FullRoomName,
			({ status, rtpCapabilities, BossId, room, First }) => {
 
				if (!status) {
					//if status came with wrong result and rtpCapabilities
					// that mean you just gone watch  the room
		
					if (rtpCapabilities) {

						setAdminId(BossId, roomDispatch);

						showTost(room, "info");
						
						setIsAudience(true, roomDispatch);
						
						startStreming(rtpCapabilities);
						const copyGuesList = [...guestList];

						copyGuesList[0].id = 0;
						copyGuesList[0].name = "";
	
						//setUserMedia(stream, roomDispatch);
						upDateGuestList(copyGuesList, roomDispatch);

						// once we have rtpCapabilities from the Router, create Device

						return;
					}
					// if error happen quit the app and got to home page
					
					showTost("this room is not streamed by the admin", "warning");

					setTimeout(function () {
						document.location.href = "/"
					}, 2000);

					return;
				}

				//if this value came as true you are the admin of this room

				if (First) {
			
				
					setAdminId(Socket.id, roomDispatch);
					showTost(`you created room : ${room}`, "success");

				} else {
					showTost(`you joined room : ${room}`, "success");

					setAdminId(BossId, roomDispatch);
				}

				startStreming(rtpCapabilities);
			}
		);

		//this event triggered to notify you there is chance to join the room

		Socket.on("FreeToJoin", ({ status }) => {
			if (status) {
				setIsFreeToJoin(true, roomDispatch);

				return;
			}

			setIsFreeToJoin(false, roomDispatch);
		});

		//this event triggered when the room admin ban you from the room
		Socket.on("GoOut", () => {
			showTost("the admin drop you from this room", "info");
			setTimeout(function () {
				document.location.href = "/";
			}, 200);
		});

		//this event trigger when you become admin and the room setting 
		Socket.on("switchAdminSetting", ({ isRoomLocked, isStream, IsPublic }) => {

			
			setAdminId(Socket.id, roomDispatch);

			isRoomPublic(IsPublic, roomDispatch);
			isRoomStream(isStream, roomDispatch);
		});

		//this event trigger when admin switch to another user
		Socket.on("switchAdmin", ({ admin }) => {
			// if you are the new admin set you as admin
			/* 
			find the new admin in the room and set
			his view to the big view and clear his 
			position in the guest list
			*/
			const copyUsersGuest = [...guestList];
			const currentUserIndx = copyUsersGuest.findIndex(
				(guest) => guest.id === admin
			);

		if (currentUserIndx) {
			copyUsersGuest[0].feed.current.srcObject = copyUsersGuest[currentUserIndx].feed.current.srcObject;
			copyUsersGuest[0].id = admin;
			copyUsersGuest[0].name = copyUsersGuest[currentUserIndx].name;
			
			copyUsersGuest[currentUserIndx].feed.current.srcObject = null;
			copyUsersGuest[currentUserIndx].id = 0;
			setAdminId(admin, roomDispatch);
			upDateGuestList(copyUsersGuest, roomDispatch);

		}
		});

		//this event trigger when you recive a privet message
		//it will save to HistoryChat

	};

	const StartUserCamra = (name) => {
		navigator.mediaDevices
			.getUserMedia({
				audio: true,
				video: {
					width: {
						min: 640,
						max: 1920,
					},
					height: {
						min: 400,
						max: 1080,
					},
				},
			})
			.then((stream) => {
				let track = stream.getVideoTracks()[0];
				let Params = {
					track,
					...params,
				};

				setParam(Params, mediaSoupDispatch);

				if (Socket.id) {
					const copyGuesList = [...guestList];
					copyGuesList[0].id = Socket.id;
					copyGuesList[0].name = name;

					setUserMedia(stream, roomDispatch);
					upDateGuestList(copyGuesList, roomDispatch);
				} 
			})
			.catch(function (err) {
				console.log("An error occurred: " + err);
				showErrorModel("No camera or microphone found. Please check your devices and try again.");
			});
	};

	return { 
		CreateOrJoinTheRoom,
		setErrorModel,
		errorModel,
		showUsernameModal,
		handleUsernameSubmit,
		username,
	};
};

const generateRandomName = () => {
	const characters = 'abcdefghijklmnopqrstuvwxyz';
	let result = '';
	for (let i = 0; i < 5; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};
