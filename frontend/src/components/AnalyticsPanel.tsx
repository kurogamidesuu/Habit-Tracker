import { useHabitAnalytics } from "../hooks/useHabitAnalytics";

interface AnalyticsPanelProps {
  habitId: string;
}

const AnalyticsPanel = ({ habitId }: AnalyticsPanelProps) => {
  const { analytics, isLoading } = useHabitAnalytics(habitId);

  if (isLoading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center text-sky-400/60 text-sm">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) return null;

  const { totalVolume, monthlyCompletionRate, chronotype, monthMatrix, weekdayFrictionMap } = analytics;
  const today = new Date();
  const currMonth = today.toLocaleString('default', { month: 'long' });
  const currDay = today.getDate();

  return (
    <div className="bg-sky-950/60 border-l-[6px] border-amber-500 px-4 py-4 flex flex-col gap-4 rounded-b-xl">

      {/* Top Stats Row */}
      <div className="grid grid-cols-3 gap-4">

        {/* Total Completions */}
        <div className="bg-sky-900/50 rounded-lg p-2 flex flex-col items-center border border-amber-500/60">
          <p className="text-[0.57em] text-sky-400 uppercase tracking-widest">Total</p>
          <p className="text-lg font-bold text-amber-400">{totalVolume}</p>
          <p className="text-[0.55em] text-sky-400">completions</p>
        </div>

        {/* Monthly Completion Rate */}
        <div className="bg-sky-900/50 rounded-lg p-2 flex flex-col items-center border border-amber-500/60">
          <p className="text-[0.57em] text-sky-400 uppercase tracking-widest">This Month</p>
          <p className="text-lg font-bold text-amber-400">{monthlyCompletionRate}%</p>
          <p className="text-[0.55em] text-sky-400">completion rate</p>
        </div>

        {/* Chrono Type */}
        <div className="bg-sky-900/50 rounded-lg p-2 flex flex-col gap-1 items-center border border-amber-500/60">
          <p className="text-[0.57em] text-sky-400 uppercase tracking-widest">You are a</p>
          <p className="text-[0.8em] font-bold text-amber-400 text-center leading-tight mt-1">{chronotype}</p>
        </div>
      </div>

      {/* Month Matrix Heatmap */}
      <div className="flex flex-col items-center">
        <p className="text-[0.65em] text-sky-400 uppercase tracking-widest mb-2">This Month - {currMonth}</p>
        <div className="grid grid-cols-7 gap-1 w-[85%]">
          {monthMatrix.map(({ day, isCompleted, isFuture }) => (
            <div
              key={day}
              className={`aspect-square rounded-sm flex items-center justify-center text-[0.55em] font-medium
                ${isFuture
                  ? 'bg-sky-900/20 text-sky-700'
                  : isCompleted
                    ? 'bg-amber-400 text-sky-950'
                    : 'bg-sky-800/50 text-sky-500'
                }
                ${currDay === day
                  ? 'border-2 border-amber-900/70'
                  : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Weekday Friction Map */}
      <div>
        <p className="text-[0.65em] text-sky-400 uppercase tracking-widest mb-2">Weekday Consistency</p>
        <div className="flex gap-1 items-end" style={{ height: '80px' }}>
          {weekdayFrictionMap.map(({ day, rate }) => (
            <div key={day} className="flex-1 flex flex-col items-center justify-end gap-1">
              <div
                className={`w-full rounded-t-sm transition-all duration-500 ${
                  rate >= 70 ? 'bg-amber-400' :
                  rate >= 40 ? 'bg-amber-400/75' :
                  'bg-sky-700/60'
                }`}
                style={{ height: `${Math.max(rate * 0.44, 4)}px` }}
              />
              <p className="text-[0.55em] text-sky-400">{day}</p>
              <p className="text-[0.55em] text-sky-300 font-medium">{rate}%</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPanel;