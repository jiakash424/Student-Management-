export default function AttendanceCard({ avgAttendance = 85 }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (avgAttendance / 100) * circumference;

  const attendanceBreakdown = [
    { label: 'Present', value: 78, color: 'bg-emerald-400' },
    { label: 'Late', value: 12, color: 'bg-amber-400' },
    { label: 'Absent', value: 10, color: 'bg-red-400' },
  ];

  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <h3 className="text-base font-bold text-gray-800 mb-4">📋 Attendance Overview</h3>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-5">
        <div className="relative">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
              opacity="0.3"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#attendanceGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{avgAttendance}%</span>
            <span className="text-[10px] text-gray-500 font-medium">Average</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5">
        {attendanceBreakdown.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
