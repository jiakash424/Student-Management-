import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import StudentCard from '../components/StudentCard';
import BarChart from '../components/BarChart';
import CalendarWidget from '../components/CalendarWidget';
import LiveSessionCard from '../components/LiveSessionCard';
import AttendanceCard from '../components/AttendanceCard';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          API.get('/students/stats'),
          API.get('/students?limit=6'),
        ]);
        setStats(statsRes.data);
        setStudents(studentsRes.data.students);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader fullScreen />;

  const chartData = stats?.progressDistribution?.map((item, idx) => {
    const labels = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'];
    const colors = [
      'from-red-400 to-rose-500',
      'from-amber-400 to-orange-500',
      'from-yellow-400 to-amber-500',
      'from-emerald-400 to-green-500',
      'from-teal-400 to-cyan-500',
    ];
    return {
      label: labels[idx] || `${item._id}`,
      value: item.count,
      color: colors[idx] || 'from-gray-400 to-gray-500',
    };
  }) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your students today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon="🎓"
            label="Active Students"
            value={stats?.activeStudents || 0}
            trend="12%"
            trendUp={true}
            color="emerald"
            delay={0}
          />
          <StatsCard
            icon="👨‍🏫"
            label="Total Students"
            value={stats?.totalStudents || 0}
            trend="8%"
            trendUp={true}
            color="teal"
            delay={100}
          />
          <StatsCard
            icon="📈"
            label="Avg Progress"
            value={`${stats?.avgProgress || 0}%`}
            trend="5%"
            trendUp={true}
            color="blue"
            delay={200}
          />
          <StatsCard
            icon="📋"
            label="Avg Attendance"
            value={`${stats?.avgAttendance || 0}%`}
            trend="3%"
            trendUp={false}
            color="purple"
            delay={300}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Student Overview + Analytics (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Student Overview</h2>
                <a
                  href="/students"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  View All →
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {students.length > 0 ? (
                  students.map((student) => (
                    <StudentCard key={student._id} student={student} />
                  ))
                ) : (
                  <div className="sm:col-span-2 glass rounded-2xl p-8 text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <p className="text-gray-600 font-medium">No students yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add some students to see them here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics */}
            <BarChart data={chartData} title="📊 Progress Distribution" />
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <LiveSessionCard />
            <AttendanceCard avgAttendance={parseFloat(stats?.avgAttendance) || 85} />
            <CalendarWidget />
          </div>
        </div>
      </div>
    </Layout>
  );
}
