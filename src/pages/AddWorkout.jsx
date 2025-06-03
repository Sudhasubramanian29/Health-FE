import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AddWorkout = () => {
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    distance: '',
    calories: '',
    date: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/workouts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/workouts');
    } catch {
      alert('Failed to log workout');
    }
  };

  return (
<div className="min-h-screen bg-gray-50 px-4 py-6">
  <div className="max-w-lg bg-white p-6 rounded-2xl shadow-md w-full lg:ml-0 mx-auto lg:mx-0">


        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Log a Workout</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Workout Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select workout type</option>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="strength">Strength Training</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              placeholder="e.g. 45"
              required
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
            <input
              type="number"
              name="distance"
              placeholder="e.g. 5"
              value={formData.distance}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
            <input
              type="number"
              name="calories"
              placeholder="e.g. 300"
              required
              value={formData.calories}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWorkout;
