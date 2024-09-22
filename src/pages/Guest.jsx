import { FaUsers } from "react-icons/fa";
import MainVideoCard from "../components/mainVideoCard";
import VideoCard from "../components/videoCard";
 export default function Lobby() {
    return (
        <>
      <div className='flex justify-center items-center gap-5' >

      <div className='flex justify-center items-center gap-5' >
      <div className="flex my-2 items-center justify-between">
      <div className="flex text-[#69696F] items-center rounded-xl border border-[#dddddd] bg-white p-1 gap-5">
        <FaUsers size={24} className='mx-2' />
        <span className="text-xl font-bold">Fun chat roome</span>
        <span className="p-3 rounded-xl bg-[#AEE8FF] font-bold">4</span>
      </div>
    
    </div>
        <button className='hover:bg-[#055777] text-white border bg-[#0D7C66] p-3   rounded-xl  '  >Join</button>
    </div>
    </div> 
    <div className='flex my-2  gap-1' > 
          <VideoCard name='Mustafa osman' />
          <VideoCard name='Mustafa osman' />
          <VideoCard name='Mustafa osman' />
    
        </div>
      <MainVideoCard />

  
      </>
    )
}