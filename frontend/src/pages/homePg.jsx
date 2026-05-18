import logo from '../assets/logo.png';
import bgImage from '../assets/images/bgImage3.jpg';
import { useAuth } from '../hooks/UseAuth';

function HomePage() {
  const { token, isLoggedIn } = useAuth();
  
  const loggedIn = !!token;
  
  console.log('Token:', token);
  console.log('Is logged in?:', loggedIn);

  return (
    <div className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white px-4 py-16"
         style={{ backgroundImage: `url(${bgImage})` }}>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        
        {/* Logo */}
        <img src={logo} alt="Company Logo" className="w-80 md:w-80 -mt-24 rounded-full shadow-lg" />

        {/* Welcome Message */}
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to Dvelupmint</h1>
        <p className="text-lg md:text-xl max-w-md">
          {loggedIn
            ? "You're logged in — enjoy your access!"
            : "Join us to build beautiful full-stack web experiences."}
        </p>

        {/* Sign Up Button */}
        {!loggedIn && (
          <a href="/register" className="bg-white text-black px-6 py-3 rounded-md font-semibold shadow-md hover:bg-gray-200 transition">
            Sign Up Now
          </a>
        )}
      </div>
    </div>
  );
}

export default HomePage;
