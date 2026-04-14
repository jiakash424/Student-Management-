import { useState, useEffect } from 'react';
import API from '../api/axios';
import Layout from '../components/Layout';

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Just grab all students without pagination for the simplified attendance view
        const { data } = await API.get('/students?limit=100');
        setStudents(data.students.sort((a, b) => b.attendance - a.attendance));
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const progressColor = (p) => {
    if (p >= 80) return 'from-emerald-400 to-green-500';
    if (p >= 60) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-rose-500';
  };

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-amber-100 text-amber-700',
    graduated: 'bg-blue-100 text-blue-700',
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Attendance Roster</h1>
          <p className="text-sm text-gray-500 mt-1">Review student attendance rates</p>
        </div>

        <div className="glass rounded-2xl overflow-hidden animate-slide-up">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading roster...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200/50">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b border-gray-100/50 hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.course}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[student.status]}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${progressColor(student.attendance)}`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${student.attendance < 60 ? 'text-red-500' : 'text-gray-700'}`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
