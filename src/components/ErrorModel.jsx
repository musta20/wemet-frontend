import React from 'react';
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const ErrorModel = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-2xl font-bold flex items-center gap-5 mb-4 text-red-500">
          <MdOutlineReportGmailerrorred size={55} />
          <span className='my-auto'>Error</span>         
        </h2>
        <p className="text-gray-700 mb-6">{message}</p>
      </div>
    </div>
  );
};

export default ErrorModel;