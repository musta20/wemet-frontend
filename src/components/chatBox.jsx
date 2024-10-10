import { useContext, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { AppContext } from '../contextApi/Contexts/AppContext';
import { SocketContext } from "../contextApi/Contexts/socket";
import { addMessageToChat } from "../contextApi/Actions/massengerHelperAction";

export default function ChatBox({ isOpen, handleNewMessage }) {
    const { roomState, massengerstate, massengerDispatch } = useContext(AppContext);
    const Socket = useContext(SocketContext);
    const { HistoryChat } = massengerstate;
    const { roomName, guestList } = roomState;
    const [messages, setChatMessage] = useState("");

    const SendMessageChat = (e) => {
        e.preventDefault();
        if (messages.trim() === "") return;
        const userName = guestList.find(item => item.id == Socket.id);
        addMessageToChat({ Message: messages, name: userName.name }, massengerDispatch);
        setChatMessage("");
        Socket.emit("Message", roomName, messages);
    };

    const receiveMessage = ({ Message, name }) => {
        addMessageToChat({ Message, name }, massengerDispatch);
        if (!isOpen) {
            console.log(handleNewMessage)
            handleNewMessage(); // Notify parent component about new message
        }
    };

    useEffect(() => {
        Socket.on("Message", receiveMessage);
        return () => {
            Socket.off("Message", receiveMessage);
        }
    }, [isOpen]);

    return ( // xl:w-5/12  min-h-[35rem]
        <div  className={`  rounded-xl border border-[#055777] flex flex-col justify-between bg-[#F1F7F9] ${isOpen ? ' block' : ' hidden'}`} >
            <div className="h-10 bg-[#055777] text-white flex items-center justify-center rounded-t-xl text-xl font-bold" >Group Chat</div>
            <div className='flex flex-col h-full border gap-5 p-5 overflow-y-scroll' >
 
            {HistoryChat.map(({Message,name}, index) => (
                <ChatMessage 
                    key={`${index}-${Math.random()}`} 
                    name={name} 
                    message={Message} 
                />
            ))}
            
            </div>
            <div className='flex items-center justify-center p-5' >
                <input type="text" placeholder='Type your message' value={messages} onChange={e=>setChatMessage(e.target.value)} className='w-full p-2 rounded-l-md border border-[#055777] bg-[#ffffff] ' /> 
                <button onClick={SendMessageChat} className='bg-[#055777] text-white border border-[#055777] p-2 rounded-r-md' >Send</button>
            </div>
        </div>
    );    
}

