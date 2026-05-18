import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navBar';
import HomePage from './pages/homePg';
import LoginPage from './pages/loginPg';
import RegisterPage from './pages/regPg';
import ClientsPage from './pages/clientsPg';
import AdminPage from './pages/adminPg';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './hooks/UseAuth';

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />


          <Route
            path="/login"
            element={!token ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!token ? <RegisterPage /> : <Navigate to="/" />}
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
