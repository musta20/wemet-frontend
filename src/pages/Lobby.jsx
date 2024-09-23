import { useNavigate } from "react-router-dom";
import RoomCard from "../components/roomCard";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contextApi/Contexts/socket";
export default function Lobby() {


    const navigate = useNavigate();

    const [Rooms, setRooms] = useState([]);
  
    const Socket = useContext(SocketContext);
 
    useEffect(() => {
      
      if (!Socket.connected) Socket.connect();

      //console.log('%c  LOBBY USE EFFECT', 'color: #00ff00; font-weight: bold; font-size: 16px;');


      //This event delete a room from the list
      Socket.off("DelteRoom").on("DelteRoom", ({ TheroomName }) => {
        let copyRooms = [...Rooms];
        let newCopy = copyRooms.filter((room) => room !== TheroomName);
  
        setRooms(newCopy);
      });
  
      //This event add a room from the list
  
      Socket.off("AddRoom").on("AddRoom", ({ title }) => {
        let copyRoom = [...Rooms];
        copyRoom.push(title);
  
        setRooms(copyRoom);
      });

    //   //Request the current live room in the server
    //   Socket.emit("getroom", "mainrrom", (data) => {
    //     setRooms(data);
    //  });

  //   Socket.emit("getroom", "mainrrom", (data) => {
  //     setRooms(data);
  //  });
 
    }, [Rooms, Socket]);

    useEffect(() => {
  
      //Request the current live room in the server
  
      Socket.emit("getroom", "mainrrom", (data) => {
         setRooms(data);
      });
    }, [Socket]);

  
 



  
    //This function will take the user to call room as viewer
  
    const GoToCallRoomWatch = (roomName) => {
   
      navigate("/meet/" + roomName, {
        state: {
          IsPublic: false,
          IsViewer: true,
        },
      });
    };
  
    //This function will take the user to room as member
    const join = (roomName) => {
   
      navigate("/meet/" + roomName, {
        state: {
          IsPublic: false,
          IsViewer: false,
        },
      });
    };
  
    //This function display empty room message

    return (
        <>
             
      <div className="text-2xl my-10 mx-auto justify-center flex text-[#055777] font-bold">
             {!Rooms.length ? null:' Online chat groups'}
      </div> 

      <div className="container w-full justify-center mx-auto px-4 py-8 ">
      <div className="text-2xl my-10 mx-auto   text-center w-full   text-[#055777] font-bold">
        
            {!Rooms.length ? 'No rooms available at the moment':null}
              
        </div> 
      <div className="grid  w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-5 gap-10 ">

            {Rooms.length
                  ? Rooms.map((roomName) => (
                    <RoomCard key={roomName} room={roomName} GoToCallRoomWatch={GoToCallRoomWatch} join={join} />
                  )) :null
                }

        </div>
        </div>
      </>
    )
}