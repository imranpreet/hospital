const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const Project = require('../models/Project');
const Note = require('../models/Note');
const User = require('../models/User');
const ProjectFile = require('../models/ProjectFile');
const { auth } = require('../middleware/auth');
const sendEmail = require('../utils/notifier');
const { generateWorkspaceInvitation } = require('../utils/notifier');

const projectUploadDir = path.join(__dirname, '../../uploads/projects');
if (!fs.existsSync(projectUploadDir)) {
  fs.mkdirSync(projectUploadDir, { recursive: true });
}

const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, projectUploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});

const projectFileFilter = (req, file, cb) => {
  const accepted = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/csv',
    'application/zip'
  ];

  if (accepted.includes(file.mimetype) || /\.(png|jpg|jpeg|webp|gif|pdf|txt|md|doc|docx|xls|xlsx|csv|zip)$/i.test(file.originalname)) {
    cb(null, true);
    return;
  }

  cb(new Error('Unsupported file type. Please upload an image, PDF, document, text file, or archive.'));
};

const projectUpload = multer({
  storage: projectStorage,
  fileFilter: projectFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

function getProjectFilePreviewMode(mimeType = 'application/octet-stream', fileName = '') {
  const type = (mimeType || '').toLowerCase();
  const name = (fileName || '').toLowerCase();

  if (type.startsWith('image/')) return 'image';
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (type.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv')) return 'text';
  return 'download';
}

function buildProjectLocalFileUrl(filename) {
  const baseUrl = process.env.BACKEND_URL || 'https://hospitalmanagement-backend-0g6l.onrender.com';
  return `${baseUrl}/uploads/projects/${filename}`;
}

function ensureProjectAccess(project, userId) {
  if (!project) return false;
  const creatorId = project.creator && project.creator.toString ? project.creator.toString() : project.creator;
  const memberIds = (project.members || []).map((member) => member && member.toString ? member.toString() : member);
  return creatorId === userId || memberIds.includes(userId);
}

async function sendProjectInvitation(project, member, creator) {
  const frontendUrl = process.env.FRONTEND_URL || 'https://hospitalmanagement-frontend-sh3z.onrender.com';
  const projectUrl = `${frontendUrl}/staff-collaboration?project=${project._id}`;
  const invitation = await generateWorkspaceInvitation({
    memberName: member.name,
    creatorName: creator?.name || 'A CityCare team member',
    projectName: project.name,
    description: project.description,
    department: project.department,
    projectUrl
  });
  const emailResult = await sendEmail(member.email, invitation.subject, invitation.body);

  return {
    email: member.email,
    subject: invitation.subject,
    contentGeneratedBy: process.env.GROQ_API_KEY ? 'groq-with-fallback' : 'local-template',
    emailSent: Boolean(emailResult?.sent),
    message: emailResult?.sent
      ? 'Invitation email sent successfully.'
      : `Member is saved, but email was not sent: ${emailResult?.reason || 'SMTP delivery failed'}.`
  };
}

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { creator: req.user.id },
        { members: req.user.id }
      ]
    })
      .populate('creator', 'name email')
      .populate('members', 'name email')
      .sort({ updatedAt: -1 });

    const projectIds = projects.map((project) => project._id);
    const [noteCounts, fileCounts] = await Promise.all([
      Note.aggregate([
        { $match: { projectId: { $in: projectIds.map((id) => id.toString()) } } },
        { $group: { _id: '$projectId', count: { $sum: 1 } } }
      ]),
      ProjectFile.aggregate([
        { $match: { projectId: { $in: projectIds.map((id) => id.toString()) } } },
        { $group: { _id: '$projectId', count: { $sum: 1 } } }
      ])
    ]);

    const noteMap = Object.fromEntries(noteCounts.map((item) => [item._id.toString(), item.count]));
    const fileMap = Object.fromEntries(fileCounts.map((item) => [item._id.toString(), item.count]));

    const enrichedProjects = projects.map((project) => ({
      ...project.toObject(),
      noteCount: noteMap[project._id.toString()] || 0,
      fileCount: fileMap[project._id.toString()] || 0
    }));

    res.json(enrichedProjects);
  } catch (err) {
    console.error('List projects error:', err);
    res.status(500).json({ msg: 'Failed to load projects' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, department } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ msg: 'Project name is required.' });
    }

    const project = new Project({
      name: name.trim(),
      description: description || '',
      department: department || 'General',
      creator: req.user.id,
      members: [req.user.id]
    });

    await project.save();
    const populated = await project.populate('creator', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ msg: 'Failed to create project' });
  }
});

router.get('/:id([0-9a-fA-F]{24})', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (!ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }

    res.json(project);
  } catch (err) {
    console.error('Fetch project error:', err);
    res.status(500).json({ msg: 'Failed to load project' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the project creator can update this workspace' });
    }

    const { name, description, department } = req.body;
    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ msg: 'Project name is required' });
    }

    if (name !== undefined) project.name = String(name).trim();
    if (description !== undefined) project.description = String(description);
    if (department !== undefined) project.department = String(department).trim() || 'General';

    await project.save();
    await project.populate('creator', 'name email');
    await project.populate('members', 'name email');
    res.json(project);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ msg: 'Failed to update project' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the project creator can delete this workspace' });
    }

    await Note.deleteMany({ projectId: req.params.id });
    await ProjectFile.deleteMany({ projectId: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ msg: 'Failed to delete project' });
  }
});

router.get('/public/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ publicSlug: req.params.slug, isPublic: true })
      .populate('creator', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ msg: 'Public project not found' });
    }

    res.json({
      _id: project._id,
      name: project.name,
      description: project.description,
      department: project.department,
      creator: project.creator,
      members: project.members,
      publicSlug: project.publicSlug,
      publicReadme: project.publicReadme || `# ${project.name}\n\n${project.description || 'No public description available.'}`,
      isPublic: true,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    });
  } catch (err) {
    console.error('Fetch public project error:', err);
    res.status(500).json({ msg: 'Failed to load public project' });
  }
});

router.post('/:id/share', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the project creator can share this workspace' });
    }

    const publicReadme = req.body?.publicReadme || `# ${project.name}\n\n## Overview\n${project.description || 'Project summary not available.'}\n\n## Department\n${project.department || 'General'}\n\n## Notes\nThis project is shared in read-only mode.`;
    const slug = req.body?.publicSlug || `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    project.isPublic = true;
    project.publicSlug = slug;
    project.publicReadme = publicReadme;
    await project.save();

    res.json({
      message: 'Project is now publicly viewable',
      publicUrl: `${process.env.FRONTEND_URL || 'https://hospitalmanagement-frontend-sh3z.onrender.com'}/public-project/${slug}`,
      publicSlug: slug,
      isPublic: true,
      publicReadme
    });
  } catch (err) {
    console.error('Share project error:', err);
    res.status(500).json({ msg: 'Failed to publish project' });
  }
});

router.post('/:id/members', auth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !String(email).trim()) {
      return res.status(400).json({ msg: 'Member email is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the project creator can add members' });
    }

    const member = await User.findOne({ email: email.trim().toLowerCase() });
    if (!member) {
      return res.status(404).json({ msg: 'User not found with that email' });
    }

    if (member._id.toString() === project.creator.toString()) {
      return res.status(400).json({ msg: 'Creator is already part of the project' });
    }

    const alreadyMember = project.members.some((m) => m.toString() === member._id.toString());

    if (!alreadyMember) {
      project.members.push(member._id);
      await project.save();
    }
    await project.populate('members', 'name email');

    const creator = await User.findById(req.user.id, 'name email');
    const invitation = await sendProjectInvitation(project, member, creator);

    res.json({
      ...project.toObject(),
      invitation,
      memberAlreadyPresent: alreadyMember
    });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ msg: 'Failed to add project member' });
  }
});

router.post('/:id/members/:memberId/invite', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email');
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the project creator can resend invitations' });
    }

    const member = project.members.find((item) => item._id.toString() === req.params.memberId);
    if (!member) return res.status(404).json({ msg: 'Member is not part of this project' });

    const creator = await User.findById(req.user.id, 'name email');
    const invitation = await sendProjectInvitation(project, member, creator);
    res.json({ invitation });
  } catch (err) {
    console.error('Resend project invitation error:', err);
    res.status(500).json({ msg: 'Failed to resend project invitation' });
  }
});

router.get('/:id/notes', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (!ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }

    const notes = await Note.find({ projectId: req.params.id })
      .populate('author', 'name email')
      .sort({ updatedAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error('List notes error:', err);
    res.status(500).json({ msg: 'Failed to load notes' });
  }
});

router.post('/:id/notes', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (!ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }

    const { title, content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ msg: 'Note content is required' });
    }

    const note = new Note({
      projectId: req.params.id,
      title: title || 'Untitled Note',
      content,
      author: req.user.id
    });

    await note.save();
    const populated = await note.populate('author', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ msg: 'Failed to save note' });
  }
});

router.put('/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    const project = await Project.findById(note.projectId);
    if (!project || !ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have permission to modify this note' });
    }

    const { title, content } = req.body;
    if (title !== undefined && !String(title).trim()) {
      return res.status(400).json({ msg: 'Note title is required' });
    }
    if (content !== undefined && !String(content).trim()) {
      return res.status(400).json({ msg: 'Note content is required' });
    }

    if (title !== undefined) note.title = String(title).trim();
    if (content !== undefined) note.content = String(content).trim();

    await note.save();
    const populated = await note.populate('author', 'name email');
    res.json(populated);
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ msg: 'Failed to update note' });
  }
});

router.delete('/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    const project = await Project.findById(note.projectId);
    if (!project || !ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have permission to delete this note' });
    }

    if (note.author.toString() !== req.user.id && project.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the note author or project creator can delete this note' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ msg: 'Failed to delete note' });
  }
});

router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (!ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }

    const memberIds = (project.members || []).map((member) => member.toString ? member.toString() : String(member));
    const [noteStats, fileStats, recentActivity] = await Promise.all([
      Note.aggregate([
        { $match: { projectId: req.params.id } },
        { $group: { _id: '$author', count: { $sum: 1 } } }
      ]),
      ProjectFile.aggregate([
        { $match: { projectId: req.params.id } },
        { $group: { _id: '$uploadedBy', count: { $sum: 1 } } }
      ]),
      Note.find({ projectId: req.params.id })
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const notesByMember = Object.fromEntries(noteStats.map((item) => [item._id.toString(), item.count]));
    const filesByMember = Object.fromEntries(fileStats.map((item) => [item._id.toString(), item.count]));

    const members = await User.find({ _id: { $in: memberIds } }, 'name email');
    const memberSummary = members.map((member) => ({
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      noteCount: notesByMember[member._id.toString()] || 0,
      fileCount: filesByMember[member._id.toString()] || 0,
      totalActivity: (notesByMember[member._id.toString()] || 0) + (filesByMember[member._id.toString()] || 0)
    }));

    const totalNotes = await Note.countDocuments({ projectId: req.params.id });
    const totalFiles = await ProjectFile.countDocuments({ projectId: req.params.id });

    res.json({
      totalNotes,
      totalFiles,
      memberSummary,
      recentActivity: recentActivity.map((item) => ({
        id: item._id,
        title: item.title,
        author: item.author ? item.author.name : 'Unknown',
        createdAt: item.createdAt
      }))
    });
  } catch (err) {
    console.error('Project analytics error:', err);
    res.status(500).json({ msg: 'Failed to load project analytics' });
  }
});

router.get('/:id/files', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (!ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }

    const files = await ProjectFile.find({ projectId: req.params.id })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error('List project files error:', err);
    res.status(500).json({ msg: 'Failed to load project files' });
  }
});

router.post('/:id/files', auth, projectUpload.single('file'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (!ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'Please select a file to upload.' });
    }

    let fileURL = buildProjectLocalFileUrl(req.file.filename);
    const hasCloudinaryDirectConfig = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (process.env.CLOUDINARY_URL || hasCloudinaryDirectConfig) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'auto',
        folder: 'hospital-project-files'
      });
      fileURL = cloudinaryResult.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const fileRecord = new ProjectFile({
      projectId: req.params.id,
      uploadedBy: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype || 'application/octet-stream',
      size: req.file.size || 0,
      fileURL,
      previewMode: getProjectFilePreviewMode(req.file.mimetype, req.file.originalname)
    });

    await fileRecord.save();
    const populated = await fileRecord.populate('uploadedBy', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Upload project file error:', err);
    res.status(500).json({ msg: err.message || 'Failed to upload project file' });
  }
});

router.delete('/:id/files/:fileId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || !ensureProjectAccess(project, req.user.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }

    const fileRecord = await ProjectFile.findOne({ _id: req.params.fileId, projectId: req.params.id });
    if (!fileRecord) {
      return res.status(404).json({ msg: 'File not found' });
    }

    if (fileRecord.uploadedBy.toString() !== req.user.id && project.creator.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You do not have permission to delete this file' });
    }

    await ProjectFile.findByIdAndDelete(req.params.fileId);
    res.json({ msg: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete project file error:', err);
    res.status(500).json({ msg: 'Failed to delete file' });
  }
});

module.exports = router;
module.exports.getProjectFilePreviewMode = getProjectFilePreviewMode;
