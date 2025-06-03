import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const NutritionLog = () => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState('');
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/nutrition', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);

      const grouped = {};
      res.data.forEach(log => {
        const logDate = new Date(log.date).toLocaleDateString();
        if (!grouped[logDate]) grouped[logDate] = 0;
        grouped[logDate] += Number(log.calories);
      });
      const chartArray = Object.entries(grouped).map(([date, calories]) => ({ date, calories }));
      setChartData(chartArray);
    } catch {
      alert('Failed to load logs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/nutrition', { foodName, calories, date }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoodName('');
      setCalories('');
      setDate('');
      setIsModalOpen(false);
      fetchLogs();
    } catch {
      alert('Failed to log food');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    try {
      await axios.delete(`/nutrition/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLogs();
    } catch {
      alert('Failed to delete log');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto  min-h-screen rounded-xl ">
     
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          🥗 Nutrition History
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition-all text-white px-6 py-3 rounded-full shadow-lg font-semibold"
        >
          <span className="text-xl font-bold leading-none">➕</span>
          Add Nutrition
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
          📊 Calories Logged by Day
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 15, right: 30, bottom: 15, left: 0 }}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 13 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#34d399"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No nutrition data to show.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3">🍽️ Food Log</h3>
        <ul>
          {logs.map((log) => (
            <li
              key={log._id}
              className="border p-4 mb-2 rounded-lg bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{log.foodName}</p>
                <p>{log.calories} kcal</p>
                <p className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(log._id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
                title="Delete"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>

     
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl rounded font-semibold mb-4">Add Nutrition Log</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Food name"
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex justify-center">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionLog;
