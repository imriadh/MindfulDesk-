import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Download, TrendingUp, Clock, Target, Award } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyStats {
  week_start: string;
  daily_stats: DailyStats[];
  total_focus_minutes: number;
  total_sessions: number;
  average_daily_focus: number;
}

interface DailyStats {
  date: string;
  total_focus_minutes: number;
  total_break_minutes: number;
  completed_sessions: number;
  active_hours: number;
}

interface UserStats {
  total_focus_sessions: number;
  current_streak: number;
  longest_streak: number;
  total_focus_minutes: number;
  achievements_unlocked: number;
  level: number;
  points: number;
}

interface ActivityState {
  is_active: boolean;
  total_active_seconds: number;
  total_idle_seconds: number;
}

export default function StatsTab() {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activityState, setActivityState] = useState<ActivityState | null>(null);

  useEffect(() => {
    loadStats();
    loadActivityState();
    
    // Update activity state every 30 seconds
    const interval = setInterval(loadActivityState, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActivityState = async () => {
    try {
      const state = await invoke<ActivityState>("get_activity_state");
      setActivityState(state);
    } catch (error) {
      console.error("Failed to load activity state:", error);
    }
  };

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const weekly = await invoke<WeeklyStats>("get_weekly_stats", {
        weekStart: today,
      });
      setWeeklyStats(weekly);

      const stats = await invoke<UserStats>("get_user_stats");
      setUserStats(stats);
    } catch (error) {
      console.error("Failed to load stats:", error);
      // Use mock data
      setWeeklyStats({
        week_start: new Date().toISOString().split("T")[0],
        daily_stats: generateMockWeeklyData(),
        total_focus_minutes: 500,
        total_sessions: 20,
        average_daily_focus: 71,
      });
      setUserStats({
        total_focus_sessions: 45,
        current_streak: 5,
        longest_streak: 12,
        total_focus_minutes: 1125,
        achievements_unlocked: 3,
        level: 3,
        points: 450,
      });
    }
  };

  const generateMockWeeklyData = (): DailyStats[] => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((_, i) => ({
      date: `2026-02-${8 + i}`,
      total_focus_minutes: Math.floor(Math.random() * 150) + 30,
      total_break_minutes: Math.floor(Math.random() * 40) + 10,
      completed_sessions: Math.floor(Math.random() * 6) + 1,
      active_hours: Math.floor(Math.random() * 4) + 1,
    }));
  };

  const exportStats = async () => {
    try {
      const csvData = await invoke<string>("export_stats", {
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        format: "csv",
      });

      // Create download link
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mindfuldesk-stats-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export stats:", error);
    }
  };

  const weeklyChartData = weeklyStats
    ? {
        labels: weeklyStats.daily_stats.map((d) => {
          const date = new Date(d.date);
          return date.toLocaleDateString("en-US", { weekday: "short" });
        }),
        datasets: [
          {
            label: "Focus Minutes",
            data: weeklyStats.daily_stats.map((d) => d.total_focus_minutes),
            borderColor: "rgb(99, 102, 241)",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Break Minutes",
            data: weeklyStats.daily_stats.map((d) => d.total_break_minutes),
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  const sessionsChartData = weeklyStats
    ? {
        labels: weeklyStats.daily_stats.map((d) => {
          const date = new Date(d.date);
          return date.toLocaleDateString("en-US", { weekday: "short" });
        }),
        datasets: [
          {
            label: "Completed Sessions",
            data: weeklyStats.daily_stats.map((d) => d.completed_sessions),
            backgroundColor: "rgba(99, 102, 241, 0.8)",
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "var(--text-primary)",
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: "var(--text-secondary)",
        },
        grid: {
          color: "var(--border-color)",
        },
      },
      x: {
        ticks: {
          color: "var(--text-secondary)",
        },
        grid: {
          color: "var(--border-color)",
        },
      },
    },
  };

  return (
    <div className="container">
      {/* Gamification Streak */}
      <div className="streak-display">
        <div className="streak-label">🔥 Current Streak</div>
        <div className="streak-number">{userStats?.current_streak || 0}</div>
        <div className="streak-label">Days</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3><Clock size={16} style={{ display: "inline", marginRight: "0.5rem" }} />Total Focus Time</h3>
          <div className="value">{Math.floor((userStats?.total_focus_minutes || 0) / 60)}h</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {(userStats?.total_focus_minutes || 0) % 60}m
          </div>
        </div>

        <div className="stat-card">
          <h3><Target size={16} style={{ display: "inline", marginRight: "0.5rem" }} />Sessions Completed</h3>
          <div className="value">{userStats?.total_focus_sessions || 0}</div>
        </div>

        <div className="stat-card">
          <h3><TrendingUp size={16} style={{ display: "inline", marginRight: "0.5rem" }} />Longest Streak</h3>
          <div className="value">{userStats?.longest_streak || 0}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>days</div>
        </div>

        <div className="stat-card">
          <h3><Award size={16} style={{ display: "inline", marginRight: "0.5rem" }} />Level</h3>
          <div className="value">{userStats?.level || 1}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {userStats?.points || 0} points
          </div>
        </div>

        <div className="stat-card">
          <h3>⚡ Active Time Today</h3>
          <div className="value">{Math.floor((activityState?.total_active_seconds || 0) / 3600)}h</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {Math.floor(((activityState?.total_active_seconds || 0) % 3600) / 60)}m active
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            ({Math.floor((activityState?.total_idle_seconds || 0) / 60)}m idle)
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-container" style={{ height: "300px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Weekly Focus & Break Time</h3>
        {weeklyChartData && <Line data={weeklyChartData} options={chartOptions} />}
      </div>

      <div className="chart-container" style={{ height: "300px", marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Completed Sessions This Week</h3>
        {sessionsChartData && <Bar data={sessionsChartData} options={chartOptions} />}
      </div>

      {/* Export Button */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button onClick={exportStats} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Download size={20} />
          Export Stats (CSV)
        </button>
      </div>
    </div>
  );
}
