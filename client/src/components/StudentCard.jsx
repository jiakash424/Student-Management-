export default function StudentCard({ student, onClick }) {
  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-amber-100 text-amber-700',
    graduated: 'bg-blue-100 text-blue-700',
  };

  const progressColor = (p) => {
    if (p >= 80) return 'from-emerald-400 to-green-500';
    if (p >= 60) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-rose-500';
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className="glass rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 group animate-fade-in"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {student.avatar ? (
            <img 
              src={`http://localhost:5000/uploads/${student.avatar}`} 
              alt={student.name}
              className="w-12 h-12 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-all duration-300"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
              {getInitials(student.name)}
            </div>
          )}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              student.status === 'active' ? 'bg-emerald-400' : student.status === 'inactive' ? 'bg-amber-400' : 'bg-blue-400'
            }`}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
            {student.name}
          </h4>
          <p className="text-xs text-gray-500 truncate">{student.course}</p>
        </div>

        {/* Status */}
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[student.status]}`}>
          {student.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-medium">Progress</span>
          <span className="text-xs font-bold text-gray-700">{student.progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100/80 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progressColor(student.progress)} transition-all duration-700 ease-out`}
            style={{ width: `${student.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
