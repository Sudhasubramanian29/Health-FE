import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LabelList
} from 'recharts';

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: '',
    duration: '',
    distance: '',
    calories: '',
    date: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(res.data);

      const grouped = {};
      res.data.forEach(w => {
        const date = new Date(w.date).toLocaleDateString();
        if (!grouped[date]) grouped[date] = { date, calories: 0 };
        grouped[date].calories += w.calories;
      });
      setChartData(Object.values(grouped));
    } catch {
      alert('Failed to load workouts');
    }
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/workouts', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setForm({ type: '', duration: '', distance: '', calories: '', date: '' });
      fetchWorkouts();
    } catch {
      alert('Failed to add workout');
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    try {
      await axios.delete(`/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkouts();
    } catch {
      alert('Failed to delete workout');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto  min-h-screen rounded-xl ">
      <h2 className="text-4xl font-bold mb-6 text-gray-900">🏋️ Workout History</h2>

      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition-all text-white px-6 py-3 rounded-full shadow-lg font-semibold mb-8"
      >
        ➕ Add Workout
      </button>

      <div className="bg-white rounded-3xl shadow-md p-6 mb-10 border border-blue-100">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">📊 Calories Burned by Day</h3>
        {chartData.length === 0 ? (
          <p className="text-gray-500 text-lg font-medium">No workout data to show.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
              <XAxis dataKey="date" tick={{ fill: '#2d3748', fontWeight: '600' }} />
              <YAxis
                tick={{ fill: '#2d3748', fontWeight: '600' }}
                label={{
                  value: 'Calories',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#2d3748',
                  fontWeight: '700'
                }}
              />
              <Tooltip contentStyle={{ backgroundColor: '#2d3748', borderRadius: '8px', color: 'white' }} />
              <Legend verticalAlign="top" wrapperStyle={{ fontWeight: '700', color: '#2b6cb0' }} />
              <Bar dataKey="calories" fill="#4299E1" radius={[10, 10, 0, 0]} name="Calories Burned">
                <LabelList dataKey="calories" position="top" fill="#2c5282" fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

     
      <div className="grid sm:grid-cols-2 gap-6">
        {workouts.map(w => (
          <div
            key={w._id}
            className="bg-white border border-gray-200 p-5 rounded-2xl hover:shadow-xl transition-all relative"
          >
            <button
              onClick={() => handleDeleteWorkout(w._id)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-lg"
              title="Delete workout"
            >
              🗑️
            </button>
            <h4 className="text-xl font-bold text-blue-700 mb-2">{w.type}</h4>
            <p><span className="font-semibold text-gray-600">Duration:</span> {w.duration} min</p>
            {w.distance && (
              <p><span className="font-semibold text-gray-600">Distance:</span> {w.distance} km</p>
            )}
            <p><span className="font-semibold text-gray-600">Calories:</span> {w.calories}</p>
            <p><span className="font-semibold text-gray-600">Date:</span> {new Date(w.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-lg relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-6 text-blue-800">Add New Workout</h3>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <input
                type="text"
                placeholder="Workout Type"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
              <input
                type="number"
                placeholder="Distance (km, optional)"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
                value={form.distance}
                onChange={(e) => setForm({ ...form, distance: e.target.value })}
              />
              <input
                type="number"
                placeholder="Calories Burned"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
              />
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <div className="flex justify-center">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Save workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
