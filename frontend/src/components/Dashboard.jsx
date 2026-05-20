import { useState, useEffect } from 'react';
import ProjectList from './ProjectList';
import TaskList from './TaskList';
import API_URL from '../config';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newProjectName, setNewProjectName] = useState('');

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || 'Member';

  const checkAuth = (res) => {
    if (res.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      return true;
    }
    return false;
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError('Error connecting to server while fetching projects');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async (projId) => {
    if (!projId) {
      setTasks([]);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/projects/${projId}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Error connecting to server while fetching tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTasks(selectedProjectId);
  }, [selectedProjectId]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newProjectName, description: 'Active Collaborative Project' })
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        const data = await res.json();
        setNewProjectName('');
        await fetchProjects();
        setSelectedProjectId(data._id);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to create project');
      }
    } catch (err) {
      setError('Failed to create project due to network error');
    } finally {
      setIsLoading(false);
    }
  };

  // Find currently selected project object
  const activeProject = projects.find(p => p._id === selectedProjectId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Dashboard</h2>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 p-3 rounded font-semibold text-center animate-pulse border border-indigo-200 dark:border-indigo-950">
          Loading... Please wait.
        </div>
      )}

      {/* Error Banner Alert */}
      {error && (
        <div className="bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-2 border-rose-500 p-4 rounded relative font-semibold" role="alert">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError('')} className="absolute top-0 bottom-0 right-0 px-4 py-3 font-bold">
            &times;
          </button>
        </div>
      )}

      {/* Dynamic Task Status Cards */}
      {selectedProjectId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
            <h4 className="text-yellow-800 font-bold text-sm uppercase">To Do</h4>
            <p className="text-3xl font-extrabold text-yellow-900 mt-2">
              {tasks.filter(t => t.status === 'To Do').length}
            </p>
          </div>
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
            <h4 className="text-blue-800 font-bold text-sm uppercase">In Progress</h4>
            <p className="text-3xl font-extrabold text-blue-900 mt-2">
              {tasks.filter(t => t.status === 'In Progress').length}
            </p>
          </div>
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
            <h4 className="text-green-800 font-bold text-sm uppercase">Done</h4>
            <p className="text-3xl font-extrabold text-green-900 mt-2">
              {tasks.filter(t => t.status === 'Done').length}
            </p>
          </div>
        </div>
      )}

      {/* Only Managers can create projects */}
      {userRole === 'Manager' && (
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="flex gap-4">
            <input 
              type="text" 
              className="border p-2 flex-grow rounded" 
              placeholder="Enter Project Name" 
              value={newProjectName} 
              onChange={(e) => setNewProjectName(e.target.value)} 
              required 
            />
            <button type="submit" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2 rounded font-semibold transition-all shadow-md">
            Create Project
          </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProjectList 
            projects={projects} 
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            fetchProjects={fetchProjects}
            checkAuth={checkAuth}
            setError={setError}
            setIsLoading={setIsLoading}
            userRole={userRole}
            users={users}
          />
        </div>
        <div className="md:col-span-2">
          {selectedProjectId ? (
            <TaskList 
              projectId={selectedProjectId} 
              project={activeProject}
              tasks={tasks}
              fetchTasks={() => fetchTasks(selectedProjectId)}
              checkAuth={checkAuth}
              setError={setError}
              setIsLoading={setIsLoading}
              userRole={userRole}
              users={users}
            />
          ) : (
            <div className="bg-white p-8 rounded shadow text-gray-500 text-center font-medium border border-dashed border-gray-300">
              Select a project from the left panel to manage tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
