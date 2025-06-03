import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from '../api/axiosConfig'; 

const Recommendations = () => {
  const navigate = useNavigate();

 
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = [
      {
        _id: '1',
        title: 'Mindful Strength Training for Everyday Energy',
        description: 'This class focuses on combining mindfulness with physical training...',
        amount: 299,
      },
      {
        _id: '2',
        title: 'Balanced Nutrition: Building Sustainable Habits',
        description: 'Discover how to make long-term changes in your diet...',
        amount: 249,
      },
      {
        _id: '3',
        title: 'Deep Stretch & Recovery for Stress Relief',
        description: 'A restorative yoga and stretch session...',
        amount: 199,
      },
      {
        _id: '4',
        title: 'Guided Meditation: Cultivating Daily Resilience',
        description: 'Learn powerful breathing techniques...',
        amount: 150,
      },
      {
        _id: '5',
        title: 'Cardio Kickboxing: Empower Through Movement',
        description: 'High-energy cardio meets martial arts...',
        amount: 350,
      },
      {
        _id: '6',
        title: 'Sleep Optimization: Habits for Restful Nights',
        description: 'Understand the science of sleep...',
        amount: 199,
      },
    ];

    setTimeout(() => {
      setClasses(mockData);
      setLoading(false);
    }, 800);
  }, []);

 
  function getBookedClassesForUser() {
    const data = JSON.parse(localStorage.getItem('bookedClassesByUser')) || {};
    return data[userId] || [];
  }


 
 

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <header className="text-center mb-10">
        <h2 className="text-3xl font-bold text-black">Recommended Classes ({classes.length})</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Curated wellness classes tailored to your goals and habits
        </p>
      </header>

      {loading ? (
        <div className="text-center text-gray-500">Loading recommendations...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{cls.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{cls.description}</p>
              <p className="text-gray-800 font-medium mb-2">Amount: ₹{cls.amount}</p>
             
            </div>
          ))}
        </div>
      )}

     
    </section>
  );
};

export default Recommendations;
