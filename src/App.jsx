import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddWorkout from './pages/AddWorkout';
import WorkoutHistory from './pages/WorkoutHistory';
import SidebarDashboard from './pages/SidebarDashborad';
import Home from './pages/Home';
import NutritionLog from './pages/NutritionLog';
import GoalTracker from './pages/GoalTracker';
import WellnessApp from './pages/WellnessApp';

import ClassScheduler from './pages/ClassScheduler';
import TrainerProfiles from './pages/TrainerProfile';
import Feedback from './pages/Feedback';
import Recommendations from './pages/Recommendations';
import Payment from './pages/Payment';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<SidebarDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/workouts/add" element={<AddWorkout />} />
        <Route path="/workouts" element={<WorkoutHistory />} />
        <Route path="/nutrition" element={<NutritionLog />} />
        <Route path="/goals" element={<GoalTracker />} />
        <Route path="/wellness" element={<WellnessApp />} />
        <Route path="/class" element={<ClassScheduler />} />
        <Route path="/trainer" element={<TrainerProfiles />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/recommendation" element={<Recommendations />} />
        <Route path="/payment" element={<Payment />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
