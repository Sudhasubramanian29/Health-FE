import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Footprints, Dumbbell, Flame, TrendingUp, LineChart } from 'lucide-react';

const ProgressBar = ({ label, value, max, Icon }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="flex items-center gap-1">
          <Icon className="w-4 h-4 text-gray-500" />
          {label}
        </span>
        <span className="font-semibold">{value} / {max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const GoalTracker = () => {
  const [goals, setGoals] = useState(null);
  const [inputs, setInputs] = useState({ steps: 0, workouts: 0, calories: 0 });

  const token = localStorage.getItem('token');

  const fetchGoals = async () => {
    try {
      const res = await axios.get('/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const defaultGoals = { steps: 0, workouts: 0, calories: 0 };
      const goalData = res.data || defaultGoals;
      setGoals(goalData);
      setInputs(goalData);
    } catch (err) {
      console.error('Failed to fetch goals', err);
      setGoals({ steps: 0, workouts: 0, calories: 0 });
    }
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post('/goals', inputs, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGoals();
    } catch (err) {
      console.error('Failed to save goals', err);
    }
  };

  const actual = {
    steps: 7200,
    workouts: 3,
    calories: 1800,
  };

  const chartData = [
    { day: 'Mon', steps: 4000, calories: 1600 },
    { day: 'Tue', steps: 8000, calories: 1900 },
    { day: 'Wed', steps: 7200, calories: 1800 },
    { day: 'Thu', steps: 6900, calories: 1750 },
    { day: 'Fri', steps: 10000, calories: 2100 },
    { day: 'Sat', steps: 3000, calories: 1500 },
    { day: 'Sun', steps: 5000, calories: 1650 },
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  if (!goals) {
    return <div className="text-center mt-10 text-gray-500">Loading goals...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-500" /> Goal Tracker
      </h2>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-green-500" /> Your Progress
          </h3>
          <ProgressBar label="Steps Today" value={actual.steps} max={goals.steps || 1} Icon={Footprints} />
          <ProgressBar label="Workouts This Week" value={actual.workouts} max={goals.workouts || 1} Icon={Dumbbell} />
          <ProgressBar label="Calories Consumed" value={actual.calories} max={goals.calories || 1} Icon={Flame} />
        </div>

       
        <div className="bg-white shadow-md rounded-lg px-6 p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Set Your Goals
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Steps</label>
              <input
                type="number"
                name="steps"
                value={inputs.steps}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Workouts / Week</label>
              <input
                type="number"
                name="workouts"
                value={inputs.workouts}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Daily Calorie Limit</label>
              <input
                type="number"
                name="calories"
                value={inputs.calories}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="flex justify-center">
           <button
           onClick={handleSave}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
           >
          Save Goals
           </button>
        </div>

          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-purple-500" /> Weekly Overview
        </h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="steps" fill="#60a5fa" name="Steps" />
              <Bar dataKey="calories" fill="#f87171" name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;
