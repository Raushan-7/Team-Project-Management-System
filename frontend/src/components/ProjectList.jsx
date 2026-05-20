import { useState } from 'react';
import API_URL from '../config';

const ProjectList = ({ 
  projects, 
  selectedProjectId, 
  setSelectedProjectId, 
  fetchProjects, 
  checkAuth,
  setError,
  setIsLoading,
  userRole,
  users
}) => {
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [selectedUserToAdd, setSelectedUserToAdd] = useState('');

  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        if (selectedProjectId === id) setSelectedProjectId(null);
        await fetchProjects();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to delete project');
      }
    } catch (err) {
      setError('Error deleting project');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (e, project) => {
    e.stopPropagation();
    setEditingProjectId(project._id);
    setEditingName(project.name);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: editingName })
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        setEditingProjectId(null);
        await fetchProjects();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to update project');
      }
    } catch (err) {
      setError('Error updating project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (project) => {
    if (!selectedUserToAdd) return;
    setIsLoading(true);
    
    const updatedMembers = [...(project.members || []).map(m => m._id || m), selectedUserToAdd];
    try {
      const res = await fetch(`${API_URL}/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ members: updatedMembers })
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        setSelectedUserToAdd('');
        await fetchProjects();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to add project member');
      }
    } catch (err) {
      setError('Error adding member to project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (project, memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    setIsLoading(true);

    const updatedMembers = (project.members || [])
      .map(m => m._id || m)
      .filter(m => m !== memberId);
      
    try {
      const res = await fetch(`${API_URL}/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ members: updatedMembers })
      });
      if (checkAuth(res)) return;
      if (res.ok) {
        await fetchProjects();
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || 'Failed to remove member');
      }
    } catch (err) {
      setError('Error removing project member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Your Projects</h3>
        {projects.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">No projects found. Create one to get started!</p>
        ) : (
          <ul className="space-y-2">
            {projects.map(project => {
              const isOwner = project.createdBy === currentUserId;
              const isSelected = selectedProjectId === project._id;

              return (
                <li 
                  key={project._id} 
                  onClick={() => setSelectedProjectId(project._id)}
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer hover:bg-violet-500/5 dark:hover:bg-violet-950/10 transition-colors ${
                    isSelected 
                      ? 'border-violet-500 bg-violet-500/10 dark:bg-violet-950/20 font-semibold' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {editingProjectId === project._id ? (
                    <form 
                      onSubmit={(e) => handleUpdate(e, project._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex gap-2 w-full"
                    >
                      <input 
                        type="text" 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border p-1 text-sm flex-grow rounded-lg text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                        required
                      />
                      <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-2 py-1 rounded-lg text-xs font-semibold">Save</button>
                      <button 
                        type="button" 
                        onClick={() => setEditingProjectId(null)}
                        className="bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center w-full">
                      <span className="text-violet-600 dark:text-violet-400 hover:underline">
                        {project.name}
                      </span>
                      {isOwner && userRole === 'Manager' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => startEdit(e, project)} 
                            className="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 text-xs"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={(e) => handleDelete(e, project._id)} 
                            className="text-rose-500 hover:text-rose-700 text-xs font-semibold"
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

      {/* Selected Project Member Collaboration Panel */}
      {selectedProjectId && (
        projects.find(p => p._id === selectedProjectId) ? (
          (() => {
            const project = projects.find(p => p._id === selectedProjectId);
            const isOwner = project.createdBy === currentUserId;
            
            const existingMemberIds = (project.members || []).map(m => m._id || m);
            const nonMembers = users.filter(u => u._id !== project.createdBy && !existingMemberIds.includes(u._id));

            return (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wide">Collaboration</h4>
                
                {/* Members List */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-400">Current Members:</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                      <span>👑 Project Owner (Manager)</span>
                    </li>
                    {(project.members || []).map(member => (
                      <li key={member._id} className="text-xs text-slate-700 dark:text-slate-300 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        <span>👤 {member.name} ({member.role})</span>
                        {isOwner && userRole === 'Manager' && (
                          <button 
                            onClick={() => handleRemoveMember(project, member._id)}
                            className="text-rose-500 hover:text-rose-700 font-bold hover:underline text-[10px]"
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Manager add member form */}
                {isOwner && userRole === 'Manager' && nonMembers.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <p className="text-xs font-semibold text-slate-400">Add Team Member:</p>
                    <div className="flex gap-2">
                      <select
                        value={selectedUserToAdd}
                        onChange={(e) => setSelectedUserToAdd(e.target.value)}
                        className="border border-slate-200 dark:border-slate-700 p-1.5 rounded-lg text-xs flex-grow bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      >
                        <option value="">-- Choose User --</option>
                        {nonMembers.map(u => (
                          <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddMember(project)}
                        disabled={!selectedUserToAdd}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        ) : null
      )}
    </div>
  );
};

export default ProjectList;
