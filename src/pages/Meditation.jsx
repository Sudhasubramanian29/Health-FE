import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

const Meditation = () => {
  const token = localStorage.getItem('token');
  const [duration, setDuration] = useState('');
  const [meditationLogs, setMeditationLogs] = useState([]);

  const fetchMeditation = async () => {
    try {
      const res = await axios.get('/mental/meditation', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeditationLogs(res.data);
    } catch {
      alert('Failed to fetch meditation logs');
    }
  };

  const submitMeditation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/mental/meditation',
        { duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDuration('');
      fetchMeditation();
    } catch {
      alert('Failed to log meditation');
    }
  };

  const deleteMeditation = async (id) => {
    if (!window.confirm('Delete this meditation session?')) return;
    try {
      await axios.delete(`/mental/meditation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMeditation();
    } catch {
      alert('Failed to delete meditation log');
    }
  };

  useEffect(() => {
    fetchMeditation();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">🧘 Meditation Tracker</h2>
      <div className="flex flex-col md:flex-row gap-6">
       
        <div className="md:w-1/2">
          <form
            onSubmit={submitMeditation}
            className="bg-white p-6 rounded shadow border"
          >
            <label className="block mb-2 font-medium text-gray-700">
              Duration (in minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter minutes"
              className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Log Session
            </button>
          </form>
        </div>

       
        <div className="md:w-1/2">
          <div className="bg-white p-6 rounded shadow border max-h-[400px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3 text-black">Session History</h3>
            {meditationLogs.length === 0 ? (
              <p className="text-gray-500">No sessions logged yet.</p>
            ) : (
              <ul className="space-y-3">
                {meditationLogs.map((log) => (
                  <li key={log._id} className="border p-3 rounded bg-gray-50 relative">
                    <p className="text-sm text-gray-600">
                      {new Date(log.date).toLocaleDateString()}
                    </p>
                    <p className="font-medium text-gray-800">
                      {log.duration} minutes
                    </p>
                    <button
                      onClick={() => deleteMeditation(log._id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Meditation;
