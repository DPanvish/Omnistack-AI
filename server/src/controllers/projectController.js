import Project from '../models/Project.js';

// @desc    Save or update a project
// @route   POST /api/projects/save
export const saveProject = async (req, res) => {
  try {
    const { projectId, name, files } = req.body;

    if (projectId) {
      const project = await Project.findOneAndUpdate(
        { _id: projectId, user: req.user._id },
        { name, files },
        { new: true }
      );
      return res.status(200).json(project);
    } else {
      const newProject = await Project.create({
        user: req.user._id,
        name,
        files,
      });
      return res.status(201).json(newProject);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving workspace' });
  }
};

// @desc    Get all user projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};