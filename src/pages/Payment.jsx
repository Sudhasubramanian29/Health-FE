import React, { useState } from 'react';
import axios from '../api/axiosConfig';

const PaymentPage = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    name: '',
    expiry: '',
    cvv: '',
    amount: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/payments', paymentData);
      setMessage(response.data.message);

      // Reset form fields after successful payment
      setPaymentData({
        cardNumber: '',
        name: '',
        expiry: '',
        cvv: '',
        amount: ''
      });
    } catch (error) {
      setMessage('Payment failed or endpoint not found');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-xl rounded-2xl bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={paymentData.cardNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name on Card"
          value={paymentData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex gap-4">
          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            value={paymentData.expiry}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            value={paymentData.cvv}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={paymentData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Pay Now
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default PaymentPage;
