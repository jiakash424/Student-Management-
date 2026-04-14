export default function LiveSessionCard() {
  const sessions = [
    {
      title: 'Advanced React Patterns',
      tutor: 'Dr. Sarah Chen',
      students: 24,
      status: 'live',
      time: '09:00 - 10:30',
    },
    {
      title: 'Data Visualization Lab',
      tutor: 'Prof. James Lee',
      students: 18,
      status: 'live',
      time: '10:00 - 11:30',
    },
    {
      title: 'Python ML Workshop',
      tutor: 'Ms. Emily Park',
      students: 32,
      status: 'upcoming',
      time: '14:00 - 15:30',
    },
  ];

  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">🔴 Live Sessions</h3>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          2 Live
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((session, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-1.5">
              <h4 className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                {session.title}
              </h4>
              {session.status === 'live' ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase">
                  Upcoming
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{session.tutor}</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {session.students} students
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{session.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
