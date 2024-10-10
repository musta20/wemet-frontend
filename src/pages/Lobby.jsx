import { useNavigate } from "react-router-dom";
import RoomCard from "../components/roomCard";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contextApi/Contexts/socket";
import { toast } from 'react-toastify';

export default function Lobby() {
    const navigate = useNavigate();
    const [Rooms, setRooms] = useState([]);
    const Socket = useContext(SocketContext);

    useEffect(() => {
        if (!Socket.connected) {
            Socket.connect();
        }

        const handleDisconnect = () => {
            toast.warning("Connection lost. Refreshing the page in 5 seconds...");
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        };

        Socket.on('disconnect', handleDisconnect);

        Socket.off("DelteRoom").on("DelteRoom", ({ TheroomName }) => {
            setRooms(prevRooms => prevRooms.filter(room => room !== TheroomName));
        });

        Socket.off("AddRoom").on("AddRoom", ({ title }) => {
            setRooms(prevRooms => [...prevRooms, title]);
        });

        return () => {
            Socket.off('disconnect', handleDisconnect);
            Socket.off("DelteRoom");
            Socket.off("AddRoom");
        };
    }, [Socket]);

    useEffect(() => {
        Socket.emit("getroom", "mainrrom", (data) => {
            setRooms(data);
        });
    }, [Socket]);

    const GoToCallRoomWatch = (roomName) => {
        navigate("/meet/" + roomName, {
            state: {
                IsPublic: false,
                IsViewer: true,
            },
        });
    };

    const join = (roomName) => {
        navigate("/meet/" + roomName, {
            state: {
                IsPublic: false,
                IsViewer: false,
            },
        });
    };

    return (
        <>
            <div className="text-2xl my-10 mx-auto justify-center flex text-[#055777] font-bold">
                {!Rooms.length ? null : ' Online chat groups'}
            </div> 

            <div className="container w-full justify-center mx-auto px-4 py-8 ">
                <div className="text-2xl my-10 mx-auto text-center w-full text-[#055777] font-bold">
                    {!Rooms.length ? 'No rooms available at the moment' : null}
                </div> 
                <div className="grid w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-5 gap-10 ">
                    {Rooms.length
                        ? Rooms.map((roomName) => (
                            <RoomCard key={roomName} room={roomName} GoToCallRoomWatch={GoToCallRoomWatch} join={join} />
                        )) : null
                    }
                </div>
            </div>
        </>
    )
}