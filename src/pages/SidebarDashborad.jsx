import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Workouts from '../pages/WorkoutHistory';
import Nutrition from '../pages/NutritionLog';
import Goals from '../pages/GoalTracker';
import Journal from '../pages/Journal';
import Meditation from '../pages/Meditation';
import StressTracker from '../pages/StressTracker';
import WellnessApp from '../pages/WellnessApp';
import axios from '../api/axiosConfig';
import ClassScheduler from './ClassScheduler';
import TrainerProfiles from './TrainerProfile';
import Recommendations from './Recommendations';
import PaymentPage from './Payment';
import FeedbackPage from './Feedback';

const SidebarDashboard = () => {
  const [activeTab, setActiveTab] = useState('wellness');
  const [mentalSubTab, setMentalSubTab] = useState('journal');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setActiveTab('wellness');
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setActiveTab('login');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setActiveTab('login');
    navigate('/');
  };

  const renderMainContent = () => {
    if (activeTab === 'login') return <Login setUser={setUser} />;
    if (activeTab === 'register') return <Register setUser={setUser} />;
    if (activeTab === 'workouts') return <Workouts />;
    if (activeTab === 'nutrition') return <Nutrition />;
    if (activeTab === 'goals') return <Goals />;
    if (activeTab === 'mental') {
      if (mentalSubTab === 'journal') return <Journal />;
      if (mentalSubTab === 'meditation') return <Meditation />;
      if (mentalSubTab === 'stress') return <StressTracker />;
    }
    if (activeTab === 'wellness') return <WellnessApp />;
    if (activeTab === 'class') return <ClassScheduler />;
    if (activeTab === 'trainer') return <TrainerProfiles />;
    if (activeTab === 'recommend') return <Recommendations />;
    if (activeTab === 'payment') return <PaymentPage />;
    if (activeTab === 'feedback') return <FeedbackPage />;
    return <div>Select a section</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 bg-white shadow flex items-center justify-between w-full fixed top-0 z-40">
        <p className="text-lg font-semibold text-gray-700">Wellness App</p>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-64 bg-white shadow-md flex flex-col fixed md:static z-30 h-full pt-16 md:pt-0`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-semibold text-lg text-gray-700">
              {user?.name || 'Guest User'}
            </p>
            <p className="text-sm text-gray-500">Wellness Member</p>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {!user ? (
            <>
              <SidebarButton label="Login" activeTab={activeTab} onClick={() => setActiveTab('login')} />
              <SidebarButton label="Register" activeTab={activeTab} onClick={() => setActiveTab('register')} />
            </>
          ) : (
            <>
              <SidebarButton label="WellnessApp" tab="wellness" activeTab={activeTab} onClick={() => setActiveTab('wellness')} />
              <SidebarButton label="Workouts" tab="workouts" activeTab={activeTab} onClick={() => setActiveTab('workouts')} />
              <SidebarButton label="Nutrition" tab="nutrition" activeTab={activeTab} onClick={() => setActiveTab('nutrition')} />
              <SidebarButton label="Goals" tab="goals" activeTab={activeTab} onClick={() => setActiveTab('goals')} />
              <SidebarButton label="Mental Health" tab="mental" activeTab={activeTab} onClick={() => { setActiveTab('mental'); setMentalSubTab('journal'); }} />

              {activeTab === 'mental' && (
                <div className="ml-4 mt-1 space-y-1">
                  <SidebarSubButton label="Journal" tab="journal" currentTab={mentalSubTab} onClick={() => setMentalSubTab('journal')} />
                  <SidebarSubButton label="Meditation" tab="meditation" currentTab={mentalSubTab} onClick={() => setMentalSubTab('meditation')} />
                  <SidebarSubButton label="Stress Tracker" tab="stress" currentTab={mentalSubTab} onClick={() => setMentalSubTab('stress')} />
                </div>
              )}

              <SidebarButton label="Trainer Profile" tab="trainer" activeTab={activeTab} onClick={() => setActiveTab('trainer')} />
              <SidebarButton label="Recommended/Classes" tab="recommend" activeTab={activeTab} onClick={() => setActiveTab('recommend')} />
              <SidebarButton label="Class Scheduler" tab="class" activeTab={activeTab} onClick={() => setActiveTab('class')} />
              <SidebarButton label="Payment" tab="payment" activeTab={activeTab} onClick={() => setActiveTab('payment')} />
              <SidebarButton label="Feedback" tab="feedback" activeTab={activeTab} onClick={() => setActiveTab('feedback')} />

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-grow overflow-auto p-6 pt-20 md:pt-6">
        {renderMainContent()}
      </main>
    </div>
  );
};

// Sidebar Button Component
const SidebarButton = ({ label, tab, activeTab, onClick }) => (
  <button
    onClick={onClick}
    className={`block w-full text-left px-4 py-2 rounded transition-colors ${
      activeTab === tab
        ? 'bg-blue-200 font-semibold text-blue-800'
        : 'text-gray-700 hover:bg-blue-100'
    }`}
  >
    {label}
  </button>
);

// Sub-Tab Button Component
const SidebarSubButton = ({ label, tab, currentTab, onClick }) => (
  <button
    onClick={onClick}
    className={`block w-full text-left px-3 py-1 rounded transition-colors ${
      currentTab === tab
        ? 'bg-blue-100 font-semibold text-blue-700'
        : 'text-gray-600 hover:bg-blue-50'
    }`}
  >
    {label}
  </button>
);

export default SidebarDashboard;
