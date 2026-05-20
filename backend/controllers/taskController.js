const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name email role');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Only the project creator can add tasks
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project creator can add tasks' });
    }

    const task = await Task.create({ 
      ...req.body, 
      projectId: req.params.projectId 
    });
    
    const populated = await Task.findById(task._id).populate('assignedTo', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(req.params.projectId || task.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Role-Based Authorization Checks
    if (req.user.role === 'Member') {
      // 1. Members can only update tasks assigned to them
      if (!task.assignedTo || task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update tasks assigned to you' });
      }

      // 2. Members can only update the "status" field
      const requestedUpdates = Object.keys(req.body);
      const isOnlyStatusUpdate = requestedUpdates.every(key => key === 'status');
      if (!isOnlyStatusUpdate) {
        return res.status(403).json({ message: 'Forbidden: Members can only update task status' });
      }
    } else if (req.user.role === 'Manager') {
      // Managers can only update tasks in projects they created
      if (project.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update tasks in projects you created' });
      }
    } else {
      return res.status(403).json({ message: 'Forbidden: Invalid role permissions' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email role');
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(req.params.projectId || task.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Only the project creator can delete tasks
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Only the project creator can delete tasks' });
    }

    await task.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
