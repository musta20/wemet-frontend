import Ajv from 'ajv';
import { useContext, useState } from 'react';
import { FcCompactCamera } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../contextApi/Contexts/socket';
import SwitchToggle from './switchToogle';
export default function Model ({ isOpen, setIsModelOpen }){
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const Socket = useContext(SocketContext);


    const [Warning, setWarning] = useState([true, ""]);
    const [NameWarning, setNameWarning] = useState([true, ""]);
    const [IsPublic, setIsPublic] = useState(true);
    const navigate = useNavigate();
    const ajv = new Ajv();
    const schema = {
        properties: {
          name: {
            type: "string",
            minLength: 5,
            maxLength: 8,
            pattern: "^[a-zA-Z0-9]{4,10}$",
          },
        },
      };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (Warning[0] && NameWarning[0]) {
        // Both room name and user name are valid
        navigate(`/meet/${roomName}`, {
          state: {
            userName: userName,
            IsPublic: IsPublic,
            IsViewer: false,
          },
        });
        
        setIsModelOpen(false); // Close the modal after navigation
      }
    };

    const isRoomValid = (value) => {
 
      if (Socket && Socket.connected) {
         Socket.emit("IsRoomExist", value, (data) => {
          if (data.status) {

            setWarning([true, "The room name is valid"]);
          } else {

            setWarning([false, "The name is not valid: " + data.room]);
          }
        });
      } else {
         setWarning([false, "Unable to check room name. Please try again."]);
      }
    };

    const onchange = (value) => {
      setRoomName(value);

      if (value.length < 3) return;

      var valid = ajv.validate(schema, { name: value });
      if (!valid) {
        if (
          ajv.errors[0].message === 'must match pattern "^[a-zA-Z0-9]{4,10}$"'
        ) {
          setWarning([
            false,
            "the name is not valid special character is not allowed",
          ]);
        } else {
          setWarning([false, "the name is not valed " + ajv.errors[0].message]);
        }

        return;
      }

      // Debounce the room validation to avoid too frequent calls
      clearTimeout(window.roomValidationTimer);
      window.roomValidationTimer = setTimeout(() => isRoomValid(value), 300);
    };

    const onchangeName = (value) => {
      setUserName(value);

      if (value.length < 3) return;

      var valid = ajv.validate(schema, { name: value });
      if (!valid) {
        if (
          ajv.errors[0].message === 'must match pattern "^[a-zA-Z0-9]{4,10}$"'
        ) {
          setNameWarning([
            false,
            "the name is not valid special character is not allowed",
          ]);
        } else {
          setNameWarning([false, "the name is not valed " + ajv.errors[0].message]);
        }  
        return;
      }
      setNameWarning([true, "valid name"]);
    };


    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50 items-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-[450px] bg-[#F1F7F9] p-10 rounded-lg transition-all duration-300 relative ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <button 
            onClick={() => setIsModelOpen(!isOpen)}
            className="absolute top-2 right-2 text-[#055777] hover:text-[#033d54]"
          >
            <IoMdClose size={24} />
          </button>
          
          <h2 className="text-xl font-bold mb-4 text-[#055777] text-center">
            Start a New Room
          </h2>
          
          <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full'>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => onchange(e.target.value)}
              className="w-full p-2  border rounded"
              required
            />
                <div className='min-h-[40px] text-sm'>
                      {Warning?.[1] && (
              <span className={`   ${Warning?.[0] ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500 '}`}>
                {Warning?.[1]}
              </span>
            
            )}
            </div>
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => onchangeName(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
              required
            />
         <div className='min-h-[40px] text-sm'>
                      {NameWarning?.[1] && (
              <span className={`   ${NameWarning?.[0] ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500 '}`}>
                {NameWarning?.[1]}
              </span>
            
            )}
            </div>
            <div className='flex items-center  gap-2'>
            <SwitchToggle isToggled={IsPublic} setIsToggled={setIsPublic} />
            <span className='text-sm text-[#055777] font-bold'>Public</span>
            </div>
            <div className="flex justify-end  ">
              <button 
                type="submit"
                className="px-4 py-2 flex items-center gap-2 bg-[#055777] hover:bg-opacity-90 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Create Room</span>
                <FcCompactCamera size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
