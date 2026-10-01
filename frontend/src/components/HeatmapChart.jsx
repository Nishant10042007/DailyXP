import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

/**
 * Wraps react-calendar-heatmap with DailyXP dark theme styling.
 * data: [{ date: "2025-04-15", count: 3 }, ...]
 */
const HeatmapChart = ({ data }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // Build a lookup map for quick access
  const lookup = {};
  if (Array.isArray(data)) {
    for (const d of data) lookup[d.date] = d.count;
  }

  return (
    <div className="heatmap-wrapper">
      <style>{`
        .heatmap-wrapper .react-calendar-heatmap text {
          fill: #475569;
          font-size: 8px;
        }
        .heatmap-wrapper .react-calendar-heatmap .color-empty {
          fill: rgba(255,255,255,0.04);
          rx: 2;
        }
        .heatmap-wrapper .react-calendar-heatmap .color-scale-1 {
          fill: rgba(139, 92, 246, 0.25);
        }
        .heatmap-wrapper .react-calendar-heatmap .color-scale-2 {
          fill: rgba(139, 92, 246, 0.50);
        }
        .heatmap-wrapper .react-calendar-heatmap .color-scale-3 {
          fill: rgba(139, 92, 246, 0.75);
        }
        .heatmap-wrapper .react-calendar-heatmap .color-scale-4 {
          fill: rgba(139, 92, 246, 1.0);
        }
        .heatmap-wrapper .react-calendar-heatmap rect {
          rx: 2;
          ry: 2;
        }
      `}</style>

      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={data || []}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty';
          if (value.count === 1) return 'color-scale-1';
          if (value.count === 2) return 'color-scale-2';
          if (value.count === 3) return 'color-scale-3';
          return 'color-scale-4';
        }}
        titleForValue={(value) =>
          value ? `${value.date}: ${value.count} completion${value.count !== 1 ? 's' : ''}` : 'No data'
        }
        showWeekdayLabels
      />

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs text-slate-500">Less</span>
        {['rgba(255,255,255,0.04)', 'rgba(139,92,246,0.25)', 'rgba(139,92,246,0.5)', 'rgba(139,92,246,0.75)', 'rgba(139,92,246,1)'].map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c, border: '1px solid rgba(255,255,255,0.07)' }} />
        ))}
        <span className="text-xs text-slate-500">More</span>
      </div>
    </div>
  );
};

export default HeatmapChart;
