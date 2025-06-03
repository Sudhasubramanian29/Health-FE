import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

const CircleStat = ({ label, value, max = 100, color, description }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center space-y-2">
      <svg width="110" height="110" className="transform -rotate-90">
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percentage / 100)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="text-xl font-bold">{Math.round(value)}</div>
      <div className="text-md text-gray-700 font-medium">{label}</div>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </div>
  );
};

const Home = () => {
  const [stats, setStats] = useState({
    workouts: 0,
    nutrition: 0,
    stress: 0,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [workoutRes, nutritionRes, goalsRes, journalRes, meditationRes, stressRes] = await Promise.all([
          axios.get('/workouts', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/nutrition', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/goals', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/mental/journal', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/mental/meditation', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/mental/stress', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const workoutsCount = Array.isArray(workoutRes.data) ? workoutRes.data.length : 0;

        const nutritionCalories = Array.isArray(nutritionRes.data)
          ? nutritionRes.data.reduce((sum, item) => sum + (item.calories || 0), 0)
          : 0;

        let stressLevel = 0;
        if (Array.isArray(stressRes.data) && stressRes.data.length > 0) {
          const levelMap = { Low: 1, Medium: 2, High: 3 };
          const sumLevel = stressRes.data.reduce((sum, item) => sum + (levelMap[item.level] || 0), 0);
          stressLevel = sumLevel / stressRes.data.length;
        }

        setStats({
          workouts: workoutsCount,
          nutrition: nutritionCalories,
          stress: stressLevel * 3.33,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-green-700 mb-3">Health & Wellness Dashboard</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Track your fitness progress, nutrition intake, and stress levels all in one place to stay balanced and healthy.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <CircleStat
          label="Workouts"
          value={stats.workouts}
          max={10}
          color="#3b82f6"
          description="Number of workouts completed this week."
        />
        <CircleStat
          label="Calories"
          value={stats.nutrition}
          max={3000}
          color="#f97316"
          description="Total calories consumed today."
        />
        <CircleStat
          label="Stress Level"
          value={stats.stress}
          max={10}
          color="#ef4444"
          description="Average daily stress based on journal entries."
        />
      </div>
    </section>
  );
};

export default Home;
