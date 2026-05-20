import { useState } from 'react';
import API_URL from '../config';

const TaskList = ({ 
  projectId, 
  project,
  tasks, 
  fetchTasks, 
  checkAuth, 
  setError, 
  setIsLoading,
  userRole,
  users
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');

  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  const isPastOrToday = (dueDateStr) => {
    if (!dueDateStr) return false;
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  };

  const possibleAssignees = [];
  if (project) {
    const ownerUser = users.find(u => u._id === project.createdBy);
    if (ownerUser) {
      possibleAssignees.push(ownerUser);
    }
    if (project.members) {
      project.members.forEach(member => {
        if (!possibleAssignees.some(a => a._id === (member._id || member))) {
          possibleAssignees.push(member);
        }
      });
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: newTaskTitle, 
          description: newTaskDesc, 
          dueDate: newTaskDueDate || undefined,
          assignedTo: newTaskAssignedTo || undefined
        })
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskDueDate('');
        setNewTaskAssignedTo('');
        await fetchTasks();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to create task');
      }
    } catch (err) {
      setError('Error creating task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        await fetchTasks();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Error updating status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setEditAssignedTo(task.assignedTo ? (task.assignedTo._id || task.assignedTo) : '');
  };

  const handleUpdateTaskDetails = async (e, taskId) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: editTitle, 
          description: editDesc, 
          dueDate: editDueDate || null,
          assignedTo: editAssignedTo || null
        })
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        setEditingTaskId(null);
        await fetchTasks();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to update task details');
      }
    } catch (err) {
      setError('Error updating task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        await fetchTasks();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to delete task');
      }
    } catch (err) {
      setError('Error deleting task');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Tasks</h3>

      {/* Instant Client-Side Search Bar */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="🔍 Search tasks by title..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm bg-slate-50 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-violet-500/20 transition-all text-slate-800 dark:text-white"
        />
      </div>
      
      {/* Create Task Form (Manager Only) */}
      {userRole === 'Manager' && (
        <form onSubmit={handleCreateTask} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl mb-6 border border-slate-100 dark:border-slate-850 space-y-3">
          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-350">Add New Task</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              type="text" 
              className="border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white" 
              placeholder="Task Title" 
              value={newTaskTitle} 
              onChange={(e) => setNewTaskTitle(e.target.value)} 
              required 
            />
            <input 
              type="date" 
              className="border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white" 
              value={newTaskDueDate} 
              onChange={(e) => setNewTaskDueDate(e.target.value)} 
            />
            <select
              value={newTaskAssignedTo}
              onChange={(e) => setNewTaskAssignedTo(e.target.value)}
              className="border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
            >
              <option value="">-- Assign To --</option>
              {possibleAssignees.map(user => (
                <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
              ))}
            </select>
          </div>
          <textarea 
            className="border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white" 
            placeholder="Task Description" 
            value={newTaskDesc} 
            onChange={(e) => setNewTaskDesc(e.target.value)}
            rows="2"
          />
          <button type="submit" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            Add Task
          </button>
        </form>
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center">No matching tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map(task => {
            const urgent = isPastOrToday(task.dueDate);
            const isEditing = editingTaskId === task._id;
            
            const taskAssigneeId = task.assignedTo ? (task.assignedTo._id || task.assignedTo) : null;
            const isAssignedToCurrentUser = taskAssigneeId === currentUserId;
            const isAllowedToUpdateStatus = userRole === 'Manager' || isAssignedToCurrentUser;

            return (
              <li 
                key={task._id} 
                className={`p-4 rounded-xl border transition-colors ${
                  urgent 
                    ? 'border-rose-500 text-rose-700 dark:text-rose-400 bg-rose-500/5' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                {isEditing ? (
                  <form onSubmit={(e) => handleUpdateTaskDetails(e, task._id)} className="space-y-3">
                    <input 
                      type="text" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)} 
                      className="border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      required
                    />
                    <textarea 
                      value={editDesc} 
                      onChange={(e) => setEditDesc(e.target.value)} 
                      className="border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      rows="2"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="date" 
                        value={editDueDate} 
                        onChange={(e) => setEditDueDate(e.target.value)} 
                        className="border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      />
                      <select
                        value={editAssignedTo}
                        onChange={(e) => setEditAssignedTo(e.target.value)}
                        className="border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      >
                        <option value="">-- Assign To --</option>
                        {possibleAssignees.map(user => (
                          <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-3 py-1 rounded-lg text-xs font-semibold">Save</button>
                      <button type="button" onClick={() => setEditingTaskId(null)} className="bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-semibold">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-grow">
                      <p className="font-bold text-base text-slate-800 dark:text-white">{task.title}</p>
                      {task.description && <p className="text-sm opacity-90 text-slate-650 dark:text-slate-350">{task.description}</p>}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-slate-600 dark:text-slate-400">
                        {task.dueDate && (
                          <p className="text-xs font-medium">
                            📅 Due Date: {new Date(task.dueDate).toLocaleDateString()}
                            {urgent && <span className="ml-2 font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px]">⚠️ Urgent</span>}
                          </p>
                        )}
                        <p className="text-xs font-medium">
                          👤 Assignee: <span className="font-semibold">{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Status:</span>
                        <select 
                          value={task.status} 
                          onChange={(e) => handleStatusChange(task._id, e.target.value)} 
                          disabled={!isAllowedToUpdateStatus}
                          className={`border border-slate-350 dark:border-slate-650 rounded-lg p-1 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-white ${
                            !isAllowedToUpdateStatus ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                        {!isAllowedToUpdateStatus && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">(Disabled: Assigned to another user)</span>
                        )}
                      </div>
                    </div>
                    
                    {userRole === 'Manager' && (
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => handleStartEdit(task)} 
                          className="text-violet-600 dark:text-violet-400 hover:text-violet-850 dark:hover:text-violet-300 text-xs font-semibold underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task._id)} 
                          className="text-rose-500 hover:text-rose-700 text-xs font-semibold underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
