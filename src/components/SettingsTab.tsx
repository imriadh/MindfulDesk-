import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Save, Award as AwardIcon, Settings as SettingsIcon, Shield, Bell } from "lucide-react";
import DistractionBlocker from "./DistractionBlocker";
import HealthReminders from "./HealthReminders";

interface FocusSettings {
  work_duration: number;
  short_break: number;
  long_break: number;
  sessions_before_long_break: number;
  auto_start_breaks: boolean;
  auto_start_focus: boolean;
  notifications_enabled: boolean;
  sound_enabled: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export default function SettingsTab() {
  const [settings, setSettings] = useState<FocusSettings>({
    work_duration: 25,
    short_break: 5,
    long_break: 15,
    sessions_before_long_break: 4,
    auto_start_breaks: false,
    auto_start_focus: false,
    notifications_enabled: true,
    sound_enabled: true,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeSection, setActiveSection] = useState<"settings" | "achievements" | "blocker" | "reminders">("settings");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    loadSettings();
    loadAchievements();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await invoke<FocusSettings>("get_focus_settings");
      setSettings(result);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const loadAchievements = async () => {
    try {
      const result = await invoke<Achievement[]>("get_achievements");
      setAchievements(result);
    } catch (error) {
      console.error("Failed to load achievements:", error);
      // Mock achievements
      setAchievements([
        {
          id: "first_session",
          title: "Getting Started",
          description: "Complete your first focus session",
          icon: "🎯",
          unlocked: true,
          unlocked_at: new Date().toISOString(),
        },
        {
          id: "five_day_streak",
          title: "Consistent Focus",
          description: "Maintain a 5-day streak",
          icon: "🔥",
          unlocked: false,
        },
        {
          id: "break_master",
          title: "Break Master",
          description: "Take 20 breaks on time",
          icon: "☕",
          unlocked: false,
        },
        {
          id: "deep_work",
          title: "Deep Work",
          description: "Focus for 100+ hours total",
          icon: "🧠",
          unlocked: false,
        },
        {
          id: "journal_habit",
          title: "Reflective Mind",
          description: "Journal for 7 consecutive days",
          icon: "📔",
          unlocked: false,
        },
        {
          id: "mindful_week",
          title: "Mindful Week",
          description: "Complete all reminders for a week",
          icon: "🌟",
          unlocked: false,
        },
      ]);
    }
  };

  const handleSave = async () => {
    try {
      await invoke("update_focus_settings", { settings });
      setSaveMessage("✓ Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage("✗ Failed to save settings");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="container">
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveSection("settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: activeSection === "settings" ? "var(--accent-color)" : "var(--bg-secondary)",
            color: activeSection === "settings" ? "white" : "var(--text-primary)",
          }}
        >
          <SettingsIcon size={20} />
          Focus Settings
        </button>
        <button
          onClick={() => setActiveSection("achievements")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: activeSection === "achievements" ? "var(--accent-color)" : "var(--bg-secondary)",
            color: activeSection === "achievements" ? "white" : "var(--text-primary)",
          }}
        >
          <AwardIcon size={20} />
          Achievements ({unlockedCount}/{achievements.length})
        </button>
        <button
          onClick={() => setActiveSection("blocker")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: activeSection === "blocker" ? "var(--accent-color)" : "var(--bg-secondary)",
            color: activeSection === "blocker" ? "white" : "var(--text-primary)",
          }}
        >
          <Shield size={20} />
          Distraction Blocker
        </button>
        <button
          onClick={() => setActiveSection("reminders")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: activeSection === "reminders" ? "var(--accent-color)" : "var(--bg-secondary)",
            color: activeSection === "reminders" ? "white" : "var(--text-primary)",
          }}
        >
          <Bell size={20} />
          Health Reminders
        </button>
      </div>

      {activeSection === "settings" && (
        <div className="card" style={{ maxWidth: "600px" }}>
          <h2 style={{ marginBottom: "2rem" }}>⚙️ Focus Settings</h2>

          <div className="form-group">
            <label>Work Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={settings.work_duration}
              onChange={(e) =>
                setSettings({ ...settings, work_duration: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="form-group">
            <label>Short Break (minutes)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.short_break}
              onChange={(e) =>
                setSettings({ ...settings, short_break: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="form-group">
            <label>Long Break (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.long_break}
              onChange={(e) =>
                setSettings({ ...settings, long_break: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="form-group">
            <label>Sessions before long break</label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.sessions_before_long_break}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sessions_before_long_break: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.auto_start_breaks}
                onChange={(e) =>
                  setSettings({ ...settings, auto_start_breaks: e.target.checked })
                }
              />
              Auto-start breaks
            </label>
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.auto_start_focus}
                onChange={(e) =>
                  setSettings({ ...settings, auto_start_focus: e.target.checked })
                }
              />
              Auto-start focus after breaks
            </label>
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.notifications_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, notifications_enabled: e.target.checked })
                }
              />
              Enable notifications
            </label>
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.sound_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, sound_enabled: e.target.checked })
                }
              />
              Enable sound alerts
            </label>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Save size={20} />
              Save Settings
            </button>
            {saveMessage && (
              <div style={{ marginTop: "1rem", color: saveMessage.includes("✓") ? "var(--success-color)" : "var(--danger-color)" }}>
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === "achievements" && (
        <div>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h2>🏆 Achievements</h2>
            <p style={{ color: "var(--text-secondary)" }}>
              You've unlocked {unlockedCount} out of {achievements.length} achievements
            </p>
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "20px",
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    width: `${(unlockedCount / achievements.length) * 100}%`,
                    height: "100%",
                    backgroundColor: "var(--accent-color)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="achievement-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${!achievement.unlocked ? "locked" : ""}`}
              >
                <div className="icon">{achievement.icon}</div>
                <div className="title">{achievement.title}</div>
                <div className="description">{achievement.description}</div>
                {achievement.unlocked && achievement.unlocked_at && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--success-color)" }}>
                    ✓ Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </div>
                )}
                {!achievement.unlocked && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    🔒 Locked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "blocker" && <DistractionBlocker />}

      {activeSection === "reminders" && <HealthReminders />}
    </div>
  );
}
