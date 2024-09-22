import { useState } from 'react';
export default function SwitchToggle({isToggled , setIsToggled}) {

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={isToggled} onChange={() => setIsToggled(!isToggled)} />
        <div className={`block w-10 h-6 rounded-full ${isToggled ? 'bg-[#AEE8FF]' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${isToggled ? 'transform translate-x-4' : ''}`}></div>
      </div>
      
    </label>
  );
}