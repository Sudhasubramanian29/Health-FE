import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StressTracker = () => {
  const token = localStorage.getItem('token');
  const [stressLevel, setStressLevel] = useState('');
  const [stressNote, setStressNote] = useState('');
  const [stressLogs, setStressLogs] = useState([]);

  const fetchStress = async () => {
    try {
      const res = await axios.get('/mental/stress', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStressLogs(res.data);
    } catch {
      alert('Failed to fetch stress logs');
    }
  };

  const submitStress = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/mental/stress',
        { level: stressLevel, note: stressNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStressLevel('');
      setStressNote('');
      fetchStress();
    } catch {
      alert('Failed to log stress');
    }
  };

  const deleteStressLog = async (id) => {
    if (!window.confirm('Delete this stress entry?')) return;
    try {
      await axios.delete(`/mental/stress/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStress();
    } catch {
      alert('Failed to delete stress entry');
    }
  };

  useEffect(() => {
    fetchStress();
  }, []);

  const transformedLogs = stressLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString(),
    level: log.level === 'Low' ? 1 : log.level === 'Medium' ? 2 : 3,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">
    
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-red-500 mb-4">Log Your Stress</h2>
        <form onSubmit={submitStress} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Level</label>
            <select
              value={stressLevel}
              onChange={(e) => setStressLevel(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Choose...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Note</label>
            <textarea
              value={stressNote}
              onChange={(e) => setStressNote(e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
              placeholder="Add note (optional)"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Log Stress
          </button>
        </form>
      </div>

      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Stress Trends</h2>
        {stressLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transformedLogs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 3]} ticks={[1, 2, 3]} tickFormatter={(val) => ['Low', 'Medium', 'High'][val - 1]} />
              <Tooltip formatter={(val) => ['Low', 'Medium', 'High'][val - 1]} labelFormatter={(label) => `Date: ${label}`} />
              <Line type="monotone" dataKey="level" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data to show chart.</p>
        )}
      </div>

   
      <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Previous Entries</h2>
        <ul className="space-y-3">
          {stressLogs.map((log) => (
            <li key={log._id} className="border p-4 rounded-lg bg-gray-50 relative">
              <div className="text-sm text-gray-500">
                {new Date(log.date).toLocaleDateString()} - <span className="font-semibold text-red-500">{log.level}</span>
              </div>
              {log.note && <p className="text-gray-700 mt-1">{log.note}</p>}
              <button
                onClick={() => deleteStressLog(log._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                title="Delete"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StressTracker;
