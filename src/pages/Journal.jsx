import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

const Journal = () => {
  const token = localStorage.getItem('token');
  const [journalEntry, setJournalEntry] = useState('');
  const [journalLogs, setJournalLogs] = useState([]);

  const fetchJournal = async () => {
    try {
      const res = await axios.get('/mental/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournalLogs(res.data);
    } catch {
      alert('Failed to fetch journal entries');
    }
  };

  const submitJournal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/mental/journal',
        { content: journalEntry },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJournalEntry('');
      fetchJournal();
    } catch {
      alert('Failed to save journal entry');
    }
  };

  const deleteJournal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await axios.delete(`/mental/journal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJournal();
    } catch {
      alert('Failed to delete entry');
    }
  };

  useEffect(() => {
    fetchJournal();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">📝 Journal</h2>
      <div className="flex flex-col md:flex-row gap-6">
      
        <div className="md:w-1/2">
          <form onSubmit={submitJournal} className="bg-white p-4 rounded shadow">
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your reflection..."
              className="w-full h-40 p-2 border rounded mb-4"
              required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Entry
            </button>
          </form>
        </div>

      
        <div className="md:w-1/2">
          <div className="bg-white p-4 rounded shadow max-h-[400px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Your Entries</h3>
            {journalLogs.length === 0 ? (
              <p className="text-gray-500">No entries yet.</p>
            ) : (
              <ul className="space-y-3">
                {journalLogs.map((log) => (
                  <li key={log._id} className="border p-3 rounded bg-gray-50 relative">
                    <p className="text-sm text-gray-600">
                      {new Date(log.date).toLocaleDateString()}
                    </p>
                    <p className="mb-1">{log.content}</p>
                    <button
                      onClick={() => deleteJournal(log._id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                      title="Delete entry"
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

export default Journal;
