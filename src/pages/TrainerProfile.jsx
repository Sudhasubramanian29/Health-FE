import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { UserCircle2 } from 'lucide-react';

const TrainerProfiles = () => {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [specialties, setSpecialties] = useState([]);

  // Form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [trainerSpecialties, setTrainerSpecialties] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const res = await axios.get('/trainers/trainers');
    setTrainers(res.data);
    setFilteredTrainers(res.data);
    extractSpecialties(res.data);
  };

  const extractSpecialties = (data) => {
    const allSpecialties = data.flatMap(trainer => trainer.specialties || []);
    const unique = ['All', ...new Set(allSpecialties)];
    setSpecialties(unique);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedSpecialty(value);
    if (value === 'All') {
      setFilteredTrainers(trainers);
    } else {
      const filtered = trainers.filter(trainer =>
        trainer.specialties?.includes(value)
      );
      setFilteredTrainers(filtered);
    }
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('experience', experience);
      formData.append('specialties', trainerSpecialties);
      if (photo) {
        formData.append('photo', photo);
      }

      await axios.post('/trainers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Trainer added successfully!');
      fetchProfiles();
      setName('');
      setBio('');
      setExperience('');
      setTrainerSpecialties('');
      setPhoto(null);
    } catch (err) {
      alert('Error uploading trainer!');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Trainer Profiles</h2>

      {/* Specialty Filter */}
      <div className="mb-6 flex justify-center">
        <select
          className="p-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          value={selectedSpecialty}
          onChange={handleFilterChange}
        >
          {specialties.map((spec, idx) => (
            <option key={idx} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* Trainer Add Form */}
      <div className="bg-white shadow-lg p-6 rounded-xl mb-10 max-w-md mx-auto border">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Add New Trainer</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Bio"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Experience (in years)"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Specialties (e.g. Yoga, Cardio)"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={trainerSpecialties}
            onChange={(e) => setTrainerSpecialties(e.target.value)}
            required
          />
          <input
            type="file"
            onChange={handlePhotoChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Trainer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map(trainer => (
          <div
            key={trainer._id}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center"
          >
            {trainer.photo ? (
              <img
                src={`http://localhost:5000${trainer.photo}`}
                alt={trainer.name}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
            ) : (
              <UserCircle2 className="w-14 h-14 text-gray-400 mb-4" />
            )}
            <h3 className="text-lg font-semibold text-gray-800">{trainer.name}</h3>
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
