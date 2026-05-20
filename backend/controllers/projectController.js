const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    // Find projects created by this user OR where they are a listed member
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { members: req.user.id }
      ]
    }).populate('members', 'name email role');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({ 
      ...req.body, 
      createdBy: req.user.id,
      members: req.body.members || []
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Only the creator (Manager) of the project can edit/update it
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project creator can edit this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('members', 'name email role');
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Only the creator of the project can delete it
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project creator can delete this project' });
    }

    await project.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
