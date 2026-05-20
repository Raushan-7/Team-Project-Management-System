import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  const userName = localStorage.getItem('name') || '';
  const userRole = localStorage.getItem('role') || '';

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen transition-colors duration-200 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* Premium Gradient Navbar */}
        <nav className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-4 text-white flex justify-between items-center shadow-lg border-b border-indigo-500/20">
          <div className="flex items-center gap-5">
            <Link to="/" className="text-xl font-bold tracking-wider bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
              Team PM
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-sm font-semibold hover:text-indigo-200 transition-colors decoration-2 underline-offset-4">
                Dashboard
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {/* Profile UI showing Role (Top Right) */}
            {isAuthenticated && userName && (
              <div className="flex items-center gap-2 border-l border-indigo-500/30 pl-4">
                {/* User Avatar Circle */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold border border-violet-400">
                  {getInitials(userName)}
                </div>
                
                {/* Name & Role Badge */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold truncate max-w-[120px]">{userName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold border w-max ${
                    userRole === 'Manager'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-700/40 text-slate-300 border-slate-600/40'
                  }`}>
                    {userRole}
                  </span>
                </div>
              </div>
            )}

            {/* Logout/Login Button */}
            {isAuthenticated ? (
              <button 
                onClick={() => { 
                  localStorage.clear(); 
                  window.location.href = '/'; 
                }} 
                className="bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                Login
              </Link>
            )}
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
