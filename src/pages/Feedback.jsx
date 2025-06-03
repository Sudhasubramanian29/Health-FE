import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchUserFeedback = async () => {
      try {
        const res = await axios.get('/feedback/my');
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedback', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newFeedback.trim();
    if (!trimmed) return alert('Feedback cannot be empty');
const isDuplicate = feedbacks.some(
  (f) => (f.text || '').trim().toLowerCase() === trimmed.toLowerCase()
);

    if (isDuplicate) return alert('You already submitted this feedback.');

    try {
      await axios.post('/feedback', { text: trimmed });
      const res = await axios.get('/feedback/my');
      setFeedbacks(res.data);
      setNewFeedback('');
    } catch (err) {
      alert('Error submitting feedback');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Feedback</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full border border-gray-300 p-3 rounded mb-2"
          rows="4"
          value={newFeedback}
          onChange={(e) => setNewFeedback(e.target.value)}
          placeholder="Write your feedback..."
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {loading ? (
        <p>Loading your feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-500">You haven’t submitted any feedback yet.</p>
      ) : (
        <div className="space-y-2">
          {feedbacks.map((f) => (
            <div key={f._id} className="border p-3 rounded bg-gray-50">
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
