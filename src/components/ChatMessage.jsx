export default function ChatMessage ({name, message}) {
    const initials = name ? name.slice(0, 2).toUpperCase():"User";
    return (
        <div className=' items-center p-1 border border-[#055777] rounded-lg bg-white'>
            <div className='flex items-center ' > 
            <div className='w-10 h-10 rounded-full bg-[#055777] text-white flex items-center justify-center font-bold mr-1'>
                {initials}
            </div>
            <div className='flex flex-col'>
                <h3 className='text-sm font-bold'>{name}</h3>
            </div>
            </div>
            <p className='text-md text-gray-500 ml-10'>{message}</p>

        </div>
    )
}