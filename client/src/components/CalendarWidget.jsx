import { useState } from 'react';

export default function CalendarWidget() {
  const [currentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = currentDate.getDate();

  // Some dummy events
  const events = [today + 2, today + 5, today + 8, today - 1].filter(
    (d) => d > 0 && d <= daysInMonth
  );

  const scheduleItems = [
    { time: '09:00', title: 'React Workshop', color: 'bg-emerald-400' },
    { time: '11:30', title: 'Data Science Lab', color: 'bg-blue-400' },
    { time: '14:00', title: 'UI/UX Review Session', color: 'bg-purple-400' },
    { time: '16:30', title: 'Python Mentoring', color: 'bg-amber-400' },
  ];

  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <h3 className="text-base font-bold text-gray-800 mb-4">📅 Schedule</h3>

      {/* Calendar Grid */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">
            {monthNames[month]} {year}
          </span>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-[10px] font-semibold text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const isToday = day === today;
            const hasEvent = events.includes(day);
            return (
              <button
                key={day}
                className={`relative w-full aspect-square rounded-lg text-xs font-medium transition-all duration-200
                  ${isToday
                    ? 'bg-brand-gradient text-white shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-gray-600 hover:bg-emerald-50/80 hover:text-emerald-700'
                  }`}
              >
                {day}
                {hasEvent && !isToday && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today&apos;s Schedule</h4>
        {scheduleItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/40 transition-colors duration-200 group"
          >
            <div className={`w-1 h-8 rounded-full ${item.color}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate group-hover:text-emerald-700 transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-gray-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
