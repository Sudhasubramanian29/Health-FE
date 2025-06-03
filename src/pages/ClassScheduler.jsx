import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    title: '',
    description: '',
    trainer: '',
    date: '',
    time: '',
    capacity: 0
  });
  const [createSuccess, setCreateSuccess] = useState(false);
  const [popup, setPopup] = useState(false);
  const [bookedClasses, setBookedClasses] = useState([]);

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
        alert("Invalid Trainer ID. Please enter a valid ID like: 663f1c6bb9f2634b9df0e2c3");
      } else {
        alert("Error: " + errMsg);
      }
      console.error("Create class failed:", errMsg);
    }
  };

  const handleBook = async (id) => {
    await axios.post('/bookings', { classId: id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPopup(true);
    setBookedClasses(prev => [...prev, id]);
    setTimeout(() => setPopup(false), 2000);
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Form */}
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

        {/* Right Side - Available Classes */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Available Classes</h2>
          <div className="grid grid-cols-1 gap-4">
            {classes.map(cls => (
              <div key={cls._id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{cls.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{cls.description}</p>
                <div className="text-sm text-gray-700 mb-1">
                  <strong>Date:</strong> {new Date(cls.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Time:</strong> {cls.time}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => handleBook(cls._id)}
                    disabled={bookedClasses.includes(cls._id)}
                    className={`px-4 py-1 rounded text-sm text-white ${
                      bookedClasses.includes(cls._id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {bookedClasses.includes(cls._id) ? 'Booked' : 'Book'}
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
