export default function BarChart({ data = [], title = 'Progress Distribution' }) {
  // Default data if none provided
  const chartData = data.length
    ? data
    : [
        { label: '0-20%', value: 2, color: 'from-red-400 to-rose-500' },
        { label: '20-40%', value: 3, color: 'from-amber-400 to-orange-500' },
        { label: '40-60%', value: 4, color: 'from-yellow-400 to-amber-500' },
        { label: '60-80%', value: 5, color: 'from-emerald-400 to-green-500' },
        { label: '80-100%', value: 6, color: 'from-teal-400 to-cyan-500' },
      ];

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <h3 className="text-base font-bold text-gray-800 mb-6">{title}</h3>

      <div className="flex items-end gap-3 h-48">
        {chartData.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              {/* Value label */}
              <span className="text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.value}
              </span>

              {/* Bar */}
              <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                <div
                  className={`w-full max-w-[40px] rounded-t-xl bg-gradient-to-t ${item.color} 
                             shadow-lg transition-all duration-700 ease-out group-hover:opacity-90 group-hover:max-w-[48px]`}
                  style={{
                    height: `${height}%`,
                    transitionDelay: `${index * 100}ms`,
                  }}
                />
              </div>

              {/* Label */}
              <span className="text-[10px] font-medium text-gray-500 text-center leading-tight whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
