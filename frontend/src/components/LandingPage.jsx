import { Link } from 'react-router-dom';

const LandingPage = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="relative overflow-hidden min-h-[85vh] flex flex-col justify-between">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full filter blur-[100px] opacity-20 dark:opacity-10 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full filter blur-[100px] opacity-25 dark:opacity-10 pointer-events-none"></div>

      {/* Main Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 flex-grow flex flex-col items-center text-center justify-center relative z-10">
        <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 animate-bounce">
          🚀 Next-Gen Project Management
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 dark:from-violet-400 dark:via-indigo-400 dark:to-fuchsia-400 bg-clip-text text-transparent leading-tight">
          Collaborate without friction. <br />
          Deliver without delay.
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed">
          A production-style Team Project Management System built for modern development teams. Assign tasks, manage member permissions, and track deadlines with ease.
        </p>

        {/* Dynamic call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center w-full max-w-md">
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all text-center"
            >
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all text-center"
              >
                Get Started Free
              </Link>
              <Link 
                to="/login" 
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-gray-600 font-bold py-3.5 px-8 rounded-xl shadow transform hover:-translate-y-0.5 transition-all text-center"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left mt-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              👥
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Team Spaces</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Create isolated workspaces for projects, invite multiple members, and collaborate in real-time.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              🔒
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Role Permissions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Define Manager and Member roles. Safeguard updates so only assignees can update task statuses.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Urgency Highlights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Instantly highlight tasks that are due today or past due with vivid urgency colors to keep deliverables on track.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-8 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Team Project Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
