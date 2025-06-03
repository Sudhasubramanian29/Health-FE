
import React, { useState } from 'react';

const Payment = () => {
  const [message, setMessage] = useState('');

  const handlePayment = () => {
   
    setMessage('Your payment was successful! You have been enrolled in the course.');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Course</h2>
      <div className="mb-6 text-center">
        <p className="text-gray-700 text-lg">Course Enrollment Fee:</p>
        <p className="text-3xl font-extrabold text-green-600">₹999</p>
      </div>
      <button
        onClick={handlePayment}
        className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        Pay & Join Course
      </button>
      {message && (
        <p className="mt-4 text-center text-green-700 font-medium transition-opacity duration-500">
          {message}
        </p>
      )}
    </div>
  );
};

export default Payment;
