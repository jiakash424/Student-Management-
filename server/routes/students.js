const express = require('express');
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

// Apply auth middleware to all routes
router.use(protect);

// @route   GET /api/students
// @desc    Get all students with search, filter, pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { search, course, status, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by course
    if (course && course !== 'all') {
      query.course = course;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      students,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Get students error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    const avgProgress = await Student.aggregate([
      { $group: { _id: null, avg: { $avg: '$progress' } } },
    ]);
    const avgAttendance = await Student.aggregate([
      { $group: { _id: null, avg: { $avg: '$attendance' } } },
    ]);

    // Progress distribution for bar chart
    const progressDist = await Student.aggregate([
      {
        $bucket: {
          groupBy: '$progress',
          boundaries: [0, 20, 40, 60, 80, 101],
          default: 'other',
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    // Course distribution
    const courseDist = await Student.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalStudents,
      activeStudents,
      avgProgress: avgProgress[0]?.avg?.toFixed(1) || 0,
      avgAttendance: avgAttendance[0]?.avg?.toFixed(1) || 0,
      progressDistribution: progressDist,
      courseDistribution: courseDist,
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/students
// @desc    Create a student
// @access  Private
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const studentData = { ...req.body };
    if (req.file) {
      studentData.avatar = req.file.filename;
    }
    const student = await Student.create(studentData);
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Create student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/students/:id
// @desc    Update a student
// @access  Private
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    const studentData = { ...req.body };
    if (req.file) {
      studentData.avatar = req.file.filename;
    }
    const student = await Student.findByIdAndUpdate(req.params.id, studentData, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Update student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student removed' });
  } catch (error) {
    console.error('Delete student error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/students/seed
// @desc    Seed dummy student data
// @access  Private
router.post('/seed', async (req, res) => {
  try {
    const dummyStudents = [
      { name: 'Alex Johnson', email: 'alex@example.com', course: 'React Development', progress: 85, attendance: 92, status: 'active', grade: 'A', phone: '+1 234-567-8901' },
      { name: 'Sarah Williams', email: 'sarah@example.com', course: 'Data Science', progress: 72, attendance: 88, status: 'active', grade: 'B+', phone: '+1 234-567-8902' },
      { name: 'Michael Brown', email: 'michael@example.com', course: 'UI/UX Design', progress: 91, attendance: 95, status: 'active', grade: 'A+', phone: '+1 234-567-8903' },
      { name: 'Emily Davis', email: 'emily@example.com', course: 'Python Programming', progress: 65, attendance: 78, status: 'active', grade: 'B', phone: '+1 234-567-8904' },
      { name: 'James Wilson', email: 'james@example.com', course: 'React Development', progress: 45, attendance: 60, status: 'inactive', grade: 'C+', phone: '+1 234-567-8905' },
      { name: 'Olivia Martinez', email: 'olivia@example.com', course: 'Data Science', progress: 88, attendance: 94, status: 'active', grade: 'A', phone: '+1 234-567-8906' },
      { name: 'William Anderson', email: 'william@example.com', course: 'Machine Learning', progress: 76, attendance: 82, status: 'active', grade: 'B+', phone: '+1 234-567-8907' },
      { name: 'Sophia Thomas', email: 'sophia@example.com', course: 'UI/UX Design', progress: 93, attendance: 97, status: 'active', grade: 'A+', phone: '+1 234-567-8908' },
      { name: 'Liam Jackson', email: 'liam@example.com', course: 'Python Programming', progress: 58, attendance: 71, status: 'active', grade: 'C+', phone: '+1 234-567-8909' },
      { name: 'Ava White', email: 'ava@example.com', course: 'React Development', progress: 82, attendance: 89, status: 'active', grade: 'A', phone: '+1 234-567-8910' },
      { name: 'Noah Harris', email: 'noah@example.com', course: 'Machine Learning', progress: 70, attendance: 85, status: 'active', grade: 'B', phone: '+1 234-567-8911' },
      { name: 'Isabella Clark', email: 'isabella@example.com', course: 'Data Science', progress: 95, attendance: 98, status: 'active', grade: 'A+', phone: '+1 234-567-8912' },
      { name: 'Ethan Lewis', email: 'ethan@example.com', course: 'UI/UX Design', progress: 40, attendance: 55, status: 'inactive', grade: 'C', phone: '+1 234-567-8913' },
      { name: 'Mia Robinson', email: 'mia@example.com', course: 'Python Programming', progress: 78, attendance: 86, status: 'active', grade: 'B+', phone: '+1 234-567-8914' },
      { name: 'Lucas Walker', email: 'lucas@example.com', course: 'React Development', progress: 67, attendance: 75, status: 'active', grade: 'B', phone: '+1 234-567-8915' },
    ];

    // Clear existing students
    await Student.deleteMany({});
    const students = await Student.insertMany(dummyStudents);

    res.status(201).json({ message: `Seeded ${students.length} students`, students });
  } catch (error) {
    console.error('Seed error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
