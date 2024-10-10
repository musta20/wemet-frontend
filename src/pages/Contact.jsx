import React, { useState } from 'react';

const ContactUs = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const email = 'support' + '@' + 'wemet.live';

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Contact Us</h1>
        
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <p className="text-lg mb-6">
            We'd love to hear from you! If you have any questions, feedback, or just want to say hello, please don't hesitate to reach out.
          </p>
          
          <div className="text-center">
            <p className="mb-4">Our email address:</p>
            <div className={`p-4 rounded-md mb-4 ${isRevealed ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {isRevealed ? (
                <span className="font-medium">{email}</span>
              ) : (
                <span className="text-gray-500">Click the button to reveal</span>
              )}
            </div>
            <button
              onClick={handleReveal}
              disabled={isRevealed}
              className={`font-bold py-2 px-4 rounded transition duration-300 ${
                isRevealed
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isRevealed ? 'Email Revealed' : 'Reveal Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;