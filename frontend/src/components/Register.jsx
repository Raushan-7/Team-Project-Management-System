import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('name', data.name);
        localStorage.setItem('userId', data._id);
        window.location.href = '/dashboard'; // Redirect directly to dashboard upon successful registration!
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Register</h2>
      {error && <p className="text-rose-500 mb-2 font-semibold">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
          <input 
            type="text" 
            placeholder="Name" 
            className="w-full border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-800 dark:text-white bg-white dark:bg-slate-800" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-800 dark:text-white bg-white dark:bg-slate-800" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-slate-800 dark:text-white bg-white dark:bg-slate-800" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Select Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
          >
            <option value="Member">Member (View & update assigned tasks status)</option>
            <option value="Manager">Manager (Create projects, manage members, full task CRUD)</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white p-2.5 rounded-xl font-semibold transition-all shadow-md">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account? <Link to="/login" className="text-violet-600 dark:text-violet-400 hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default Register;
