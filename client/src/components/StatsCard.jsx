export default function StatsCard({ icon, label, value, trend, trendUp, color = 'emerald', delay = 0 }) {
  const colorMap = {
    emerald: {
      bg: 'from-emerald-500 to-green-500',
      shadow: 'shadow-emerald-500/20',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    teal: {
      bg: 'from-teal-500 to-cyan-500',
      shadow: 'shadow-teal-500/20',
      light: 'bg-teal-50',
      text: 'text-teal-600',
    },
    blue: {
      bg: 'from-blue-500 to-indigo-500',
      shadow: 'shadow-blue-500/20',
      light: 'bg-blue-50',
      text: 'text-blue-600',
    },
    purple: {
      bg: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/20',
      light: 'bg-purple-50',
      text: 'text-purple-600',
    },
  };

  const c = colorMap[color] || colorMap.emerald;

  return (
    <div
      className="glass rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-semibold ${
                  trendUp ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {trendUp ? '↑' : '↓'} {trend}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-lg ${c.shadow}
                      group-hover:scale-110 transition-transform duration-300`}
        >
          <span className="text-xl text-white">{icon}</span>
        </div>
      </div>
    </div>
  );
}
