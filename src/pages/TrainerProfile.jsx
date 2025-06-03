import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { UserCircle2 } from 'lucide-react';

const TrainerProfiles = () => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const res = await axios.get('/trainers/trainers');
    setTrainers(res.data);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Trainer Profiles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map(trainer => (
          <div key={trainer._id} className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center">
            <UserCircle2 className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">{trainer.name}</h3>

            <p className="text-sm text-gray-500">{trainer.bio}</p>
            <p className="text-sm text-gray-600 mt-2">Experience: {trainer.experience} years</p>
            <p className="text-sm text-gray-600">
              Specialties: {trainer.specialties?.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerProfiles;
