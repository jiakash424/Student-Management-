import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import Layout from '../components/Layout';
import StudentTable from '../components/StudentTable';
import Modal from '../components/Modal';

const courses = [
  'React Development',
  'Data Science',
  'UI/UX Design',
  'Python Programming',
  'Machine Learning',
];

const emptyForm = {
  name: '',
  email: '',
  course: '',
  progress: 0,
  attendance: 0,
  status: 'active',
  grade: '-',
  phone: '',
  dateOfBirth: '',
  address: '',
  parentName: '',
  avatar: null,
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) params.set('search', search);
      if (courseFilter !== 'all') params.set('course', courseFilter);

      const { data } = await API.get(`/students?${params}`);
      setStudents(data.students);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error('Fetch students error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, courseFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.email || !form.course) {
      setFormError('Name, email, and course are required');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'avatar' && form[key]) {
          formData.append('avatar', form[key]);
        } else if (key !== 'avatar') {
          formData.append(key, form[key]);
        }
      });
      formData.set('progress', Number(form.progress));
      formData.set('attendance', Number(form.attendance));

      await API.post('/students', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAddModal(false);
      setForm(emptyForm);
      fetchStudents();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.email || !form.course) {
      setFormError('Name, email, and course are required');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'avatar' && form[key]) {
          formData.append('avatar', form[key]);
        } else if (key !== 'avatar' && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });
      formData.set('progress', Number(form.progress));
      formData.set('attendance', Number(form.attendance));

      await API.put(`/students/${selectedStudent._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowEditModal(false);
      setSelectedStudent(null);
      setForm(emptyForm);
      fetchStudents();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await API.delete(`/students/${selectedStudent._id}`);
      setShowDeleteModal(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (student) => {
    setSelectedStudent(student);
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      progress: student.progress,
      attendance: student.attendance,
      status: student.status,
      grade: student.grade,
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      address: student.address || '',
      parentName: student.parentName || '',
      avatar: null,
    });
    setFormError('');
    setShowEditModal(true);
  };

  const openDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const seedStudents = async () => {
    setSubmitting(true);
    try {
      await API.post('/students/seed');
      fetchStudents();
    } catch (error) {
      console.error('Seed error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const StudentForm = ({ onSubmit, buttonLabel }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/50 text-red-600 text-sm font-medium animate-fade-in">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-glass"
            placeholder="Student name"
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Avatar Image</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 bg-white/50 backdrop-blur-md border border-white/40 focus:outline-none rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input-glass"
            placeholder="student@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Course *</label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className="input-glass"
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input-glass"
            placeholder="+1 234-567-8901"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Parent/Guardian Name</label>
          <input
            name="parentName"
            value={form.parentName}
            onChange={handleChange}
            className="input-glass"
            placeholder="Parent name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="input-glass"
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="input-glass"
            placeholder="123 Example St, City, Country"
            rows="2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Progress (%)
          </label>
          <input
            name="progress"
            type="number"
            min="0"
            max="100"
            value={form.progress}
            onChange={handleChange}
            className="input-glass text-center font-mono font-semibold"
            placeholder="e.g. 85"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Attendance (%)
          </label>
          <input
            name="attendance"
            type="number"
            min="0"
            max="100"
            value={form.attendance}
            onChange={handleChange}
            className="input-glass text-center font-mono font-semibold"
            placeholder="e.g. 92"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input-glass"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Grade</label>
          <select
            name="grade"
            value={form.grade}
            onChange={handleChange}
            className="input-glass"
          >
            {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', '-'].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setForm(emptyForm);
            setFormError('');
          }}
          className="btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center gap-2 disabled:opacity-60"
        >
          {submitting && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {buttonLabel}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Students</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your students • {total} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={seedStudents}
              disabled={submitting}
              className="btn-secondary text-sm disabled:opacity-60"
            >
              🌱 Seed Data
            </button>
            <button
              onClick={() => {
                setForm(emptyForm);
                setFormError('');
                setShowAddModal(true);
              }}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-glass pl-10 text-sm"
                placeholder="Search students by name or email..."
              />
            </div>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setPage(1);
              }}
              className="input-glass text-sm w-full sm:w-48"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <StudentTable
          students={students}
          loading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 animate-fade-in">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-300
                  ${
                    page === i + 1
                      ? 'bg-brand-gradient text-white shadow-md shadow-emerald-500/20'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setForm(emptyForm);
          setFormError('');
        }}
        title="Add New Student"
        size="lg"
      >
        <StudentForm onSubmit={handleAdd} buttonLabel="Add Student" />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
          setForm(emptyForm);
          setFormError('');
        }}
        title="Edit Student"
        size="lg"
      >
        <StudentForm onSubmit={handleEdit} buttonLabel="Save Changes" />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
        }}
        title="Delete Student"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-800 mb-2">Are you sure?</h4>
          <p className="text-sm text-gray-500 mb-6">
            This will permanently delete <span className="font-semibold text-gray-700">{selectedStudent?.name}</span>.
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedStudent(null);
              }}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
