import { useState, useEffect } from 'react';
import LoginRegister from './Login';

const carouselImages = [
  '/image5.jpg',
  '/image3.jpg',
  '/image1.avif',
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center relative">
     
      <div className="relative w-[90%] max-w-4xl h-[80%] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(255,165,0,0.5)]">
        <img
          src={carouselImages[currentSlide]}
          alt="Slide"
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
        />

       
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-6 transform -translate-y-1/2 z-10">
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
              )
            }
            className="bg-white bg-opacity-70 px-3 py-1 rounded-full hover:bg-opacity-90"
          >
            ◀
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
            }
            className="bg-white bg-opacity-70 px-3 py-1 rounded-full hover:bg-opacity-90"
          >
            ▶
          </button>
        </div>

       
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-50 text-center p-4 z-0">
          <h1 className="text-4xl font-bold mb-4">Health & Wellness App</h1>
          <p className="mb-6 max-w-xl">
            Track workouts, set goals, and achieve wellness all in one place.
          </p>
          <button
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Get Started
          </button>
        </div>
      </div>

      {showAuthModal && (
        <>
      
          <div
            onClick={() => setShowAuthModal(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>

           <div className="fixed top-1/2 right-0 transform -translate-y-1/2 w-[300px] h-auto max-h-[600px] border rounded-xl shadow-lg p-5 z-50 flex flex-col overflow-y-auto">
  <button
    onClick={() => setShowAuthModal(false)}
    className="self-end text-gray-600 hover:text-red-600 text-2xl font-bold mb-2"
    aria-label="Close modal"
  >
    &times;
  </button>

  <LoginRegister
    mode={authMode}
    setMode={setAuthMode}
    setUser={handleLoginSuccess}
  />
</div>


        </>
      )}
    </div>
  );
};

export default Home;
