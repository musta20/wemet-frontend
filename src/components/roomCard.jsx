
export default function RoomCard({room ,GoToCallRoomWatch , join}) {

    return (
        <div className="bg-white w-64 h-44 hover:scale-105 transition-all duration-300 rounded-lg shadow-md p-4 relative overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-center z-0 "
                style={{backgroundImage: `url('http://localhost:6800/imges/${room}.png')`}}
            ></div>
            <div className="relative z-10">
                <h2 className="text-md  font-semibold bg-black bg-opacity-50 p-3 w-1/2 rounded-md text-gray-100">{room}</h2>
                <div className="mt-4 flex justify-center gap-2">
   


                <button 
                    onClick={() => GoToCallRoomWatch(room)}
                    className='flex items-center hover:scale-105 transition-all duration-300 text-white rounded-full bg-[#0AA1DD] p-3 gap-2'
                >
                    Watch
                </button>



                <button 
                    onClick={() => join(room)}
                    className='flex items-center hover:scale-105 transition-all duration-300 text-white rounded-full bg-[#0D7C66] p-3 gap-2'
                >
                    Join
                </button>
                </div>
            </div>
        </div>
    )
}