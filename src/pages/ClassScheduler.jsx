import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    title: '', description: '', trainer: '', date: '', time: '', capacity: 0
  });
  const [createSuccess, setCreateSuccess] = useState(false);
  const [popup, setPopup] = useState(false);
  const [bookedClasses, setBookedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '', expiry: '', cvv: ''
  });

  const token = localStorage.getItem('token');

  const fetchClasses = async () => {
    const res = await axios.get('/classes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setClasses(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) : value
    }));
  };

  const handleCreate = async () => {
    try {
      await axios.post('/classes', newClass, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCreateSuccess(true);
      setTimeout(() => setCreateSuccess(false), 2000);
      fetchClasses();
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message;
      if (errMsg.includes("Cast to ObjectId failed")) {
        alert("Invalid Trainer ID. Please enter a valid one.");
      } else {
        alert("Error: " + errMsg);
      }
    }
  };

  const openPayment = (cls) => {
    setSelectedClass(cls);
    setShowPayment(true);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/bookings', { classId: selectedClass._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookedClasses(prev => [...prev, selectedClass._id]);
      setPopup(true);
      setShowPayment(false);
      setTimeout(() => setPopup(false), 2000);
    } catch (error) {
      alert("Booking failed.");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/classes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchClasses();
    setBookedClasses(prev => prev.filter(bookedId => bookedId !== id));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto min-h-screen">
      {createSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">
          Class created successfully!
        </div>
      )}
      {popup && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">
          Booked successfully!
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handlePaymentSubmit} className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Payment for {selectedClass?.title}</h3>
            <input name="cardNumber" placeholder="Card Number" onChange={handlePaymentChange} className="border p-2 mb-2 w-full" required />
            <input name="expiry" placeholder="Expiry (MM/YY)" onChange={handlePaymentChange} className="border p-2 mb-2 w-full" required />
            <input name="cvv" placeholder="CVV" onChange={handlePaymentChange} className="border p-2 mb-4 w-full" required />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowPayment(false)} className="text-gray-600">Cancel</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Pay & Book</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Schedule a Class</h2>
          <input name="title" placeholder="Title" onChange={handleChange} className="border p-2 mb-2 w-full" />
          <input name="description" placeholder="Description" onChange={handleChange} className="border p-2 mb-2 w-full" />
          <input name="trainer" placeholder="Trainer ID" onChange={handleChange} className="border p-2 mb-2 w-full" />
          <input name="date" type="date" onChange={handleChange} className="border p-2 mb-2 w-full" />
          <input name="time" type="time" onChange={handleChange} className="border p-2 mb-2 w-full" />
          <input name="capacity" type="number" placeholder="Capacity" onChange={handleChange} className="border p-2 mb-4 w-full" />
          <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Create</button>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Available Classes</h2>
          <div className="grid grid-cols-1 gap-4">
            {classes.map(cls => (
              <div key={cls._id} className="bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{cls.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{cls.description}</p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Date:</strong> {new Date(cls.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Time:</strong> {cls.time}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => openPayment(cls)}
                    disabled={bookedClasses.includes(cls._id)}
                    className={`px-4 py-1 rounded text-sm text-white ${
                      bookedClasses.includes(cls._id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {bookedClasses.includes(cls._id) ? 'Booked' : 'Book & Pay'}
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="text-red-500 hover:text-red-600 text-lg"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
