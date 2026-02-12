import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Line } from "react-chartjs-2";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

interface JournalEntry {
  id?: number;
  date: string;
  mood: number;
  notes: string;
  created_at: string;
}

interface MoodTrend {
  date: string;
  average_mood: number;
  screen_time_minutes: number;
}

const moodEmojis = ["😞", "😕", "😐", "😊", "😄"];
const moodLabels = ["Very Bad", "Bad", "Okay", "Good", "Great"];

export default function JournalTab() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [moodTrends, setMoodTrends] = useState<MoodTrend[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mood: 3,
    notes: "",
  });

  useEffect(() => {
    loadEntries();
    loadMoodTrends();
  }, []);

  const loadEntries = async () => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const result = await invoke<JournalEntry[]>("get_journal_entries", {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
      setEntries(result);
    } catch (error) {
      console.error("Failed to load entries:", error);
      // Mock data
      setEntries([
        {
          id: 1,
          date: "2026-02-12",
          mood: 4,
          notes: "Great day! Completed all my focus sessions and felt very productive.",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          date: "2026-02-11",
          mood: 3,
          notes: "Okay day. Had some distractions but managed to stay on track.",
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const loadMoodTrends = async () => {
    try {
      const result = await invoke<MoodTrend[]>("get_mood_trends", {
        days: 14,
      });
      setMoodTrends(result);
    } catch (error) {
      console.error("Failed to load mood trends:", error);
      // Mock data
      const mockTrends: MoodTrend[] = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        mockTrends.push({
          date: date.toISOString().split("T")[0],
          average_mood: Math.random() * 2 + 3, // 3-5 range
          screen_time_minutes: Math.floor(Math.random() * 120) + 60,
        });
      }
      setMoodTrends(mockTrends);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await invoke("update_journal_entry", {
          id: editingId,
          mood: formData.mood,
          notes: formData.notes,
        });
      } else {
        await invoke("add_journal_entry", {
          date: formData.date,
          mood: formData.mood,
          notes: formData.notes,
        });
      }

      // Reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        mood: 3,
        notes: "",
      });
      setIsAdding(false);
      setEditingId(null);

      // Reload entries
      await loadEntries();
      await loadMoodTrends();
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setFormData({
      date: entry.date,
      mood: entry.mood,
      notes: entry.notes,
    });
    setEditingId(entry.id || null);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await invoke("delete_journal_entry", { id });
      await loadEntries();
      await loadMoodTrends();
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      mood: 3,
      notes: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const moodChartData = {
    labels: moodTrends.map((t) => {
      const date = new Date(t.date);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Mood",
        data: moodTrends.map((t) => t.average_mood),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Screen Time (hours)",
        data: moodTrends.map((t) => t.screen_time_minutes / 60),
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "var(--text-primary)",
        },
      },
      title: {
        display: true,
        text: "Mood vs Screen Time Trends",
        color: "var(--text-primary)",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        min: 1,
        max: 5,
        ticks: {
          color: "var(--text-secondary)",
          callback: function(value: any) {
            return moodLabels[value - 1] || value;
          },
        },
        grid: {
          color: "var(--border-color)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "var(--text-secondary)",
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
      {/* Add Entry Button */}
      {!isAdding && (
        <div style={{ marginBottom: "2rem" }}>
          <button onClick={() => setIsAdding(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={20} />
            Add Journal Entry
          </button>
        </div>
      )}

      {/* Entry Form */}
      {isAdding && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>
            {editingId ? "Edit Journal Entry" : "New Journal Entry"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>How are you feeling?</label>
              <div className="mood-selector">
                {moodEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`mood-button ${formData.mood === index + 1 ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, mood: index + 1 })}
                    title={moodLabels[index]}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                {moodLabels[formData.mood - 1]}
              </div>
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="How was your day? Any insights or reflections..."
              />
            </div>

            <div className="button-group">
              <button type="submit" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Save size={20} />
                {editingId ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mood Trends Chart */}
      {moodTrends.length > 0 && (
        <div className="chart-container" style={{ height: "350px", marginBottom: "2rem" }}>
          <Line data={moodChartData} options={chartOptions} />
        </div>
      )}

      {/* Journal Entries */}
      <div>
        <h3 style={{ marginBottom: "1rem" }}>Recent Entries</h3>
        {entries.length === 0 ? (
          <div className="card" style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            No journal entries yet. Start tracking your mood and reflections!
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="journal-entry">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <div className="date">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="mood">
                    {moodEmojis[entry.mood - 1]} {moodLabels[entry.mood - 1]}
                  </div>
                  {entry.notes && <div className="notes">{entry.notes}</div>}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(entry)}
                    style={{ padding: "0.5rem", backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => entry.id && handleDelete(entry.id)}
                    style={{ padding: "0.5rem", backgroundColor: "var(--danger-color)" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
