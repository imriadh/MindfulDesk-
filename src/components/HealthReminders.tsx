import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { Bell, BellOff, Plus, X, Edit2, Check } from "lucide-react";
import { StorageManager, STORAGE_KEYS } from "../utils/storage";
import LoadingSpinner from "./LoadingSpinner";

interface HealthReminder {
  id: string;
  reminder_type: "Hydration" | "Stretching" | "EyeRest" | "Posture" | "Custom";
  interval_minutes: number;
  message: string;
  enabled: boolean;
  last_triggered?: string;
}

interface ReminderSettings {
  reminders: HealthReminder[];
  enabled: boolean;
  only_during_focus: boolean;
}

export default function HealthReminders() {
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editInterval, setEditInterval] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({ interval: 30, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Persist settings to localStorage whenever they change
    if (settings) {
      StorageManager.save(STORAGE_KEYS.REMINDER_SETTINGS, settings);
    }
  }, [settings]);

  useEffect(() => {
    if (!settings || !settings.enabled) return;

    // Set up reminder timers
    const intervals: any[] = [];
    settings.reminders.forEach((reminder) => {
      if (reminder.enabled) {
        const intervalId = setInterval(async () => {
          try {
            await sendNotification({
              title: "Health Reminder",
              body: reminder.message,
            });
          } catch (error) {
            console.error("Failed to send notification:", error);
          }
        }, reminder.interval_minutes * 60 * 1000);
        intervals.push(intervalId);
      }
    });

    return () => {
      intervals.forEach((id) => clearInterval(id));
    };
  }, [settings]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const result = await invoke<ReminderSettings>("get_reminder_settings");
      setSettings(result);
    } catch (error) {
      console.error("Failed to load reminder settings from backend:", error);
      // Fallback to localStorage
      const cached = StorageManager.load<ReminderSettings | null>(
        STORAGE_KEYS.REMINDER_SETTINGS,
        null
      );
      if (cached) {
        setSettings(cached);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleReminders = async () => {
    if (!settings) return;
    const newSettings = { ...settings, enabled: !settings.enabled };
    try {
      await invoke("update_reminder_settings", { settings: newSettings });
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to update reminders:", error);
    }
  };

  const handleToggleReminder = async (id: string) => {
    try {
      await invoke("toggle_reminder", { id });
      loadSettings();
    } catch (error) {
      console.error("Failed to toggle reminder:", error);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await invoke("delete_reminder", { id });
      loadSettings();
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  const handleStartEdit = (reminder: HealthReminder) => {
    setEditingId(reminder.id);
    setEditMessage(reminder.message);
    setEditInterval(reminder.interval_minutes);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await invoke("update_reminder", {
        id,
        intervalMinutes: editInterval,
        message: editMessage,
        enabled: null,
      });
      setEditingId(null);
      loadSettings();
    } catch (error) {
      console.error("Failed to update reminder:", error);
    }
  };

  const handleAddCustomReminder = async () => {
    if (!newReminder.message) return;
    try {
      await invoke("add_custom_reminder", {
        intervalMinutes: newReminder.interval,
        message: newReminder.message,
      });
      setNewReminder({ interval: 30, message: "" });
      setShowAddForm(false);
      loadSettings();
    } catch (error) {
      console.error("Failed to add reminder:", error);
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "Hydration":
        return "💧";
      case "Stretching":
        return "🧘";
      case "EyeRest":
        return "👁️";
      case "Posture":
        return "🪑";
      case "Custom":
        return "⏰";
      default:
        return "🔔";
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading health reminders..." />;
  }

  if (!settings) {
    return (
      <div className="card">
        <p style={{ color: 'var(--text-secondary)' }}>
          Failed to load health reminder settings.
        </p>
        <button onClick={loadSettings}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2>🔔 Health Reminders</h2>
          <button
            onClick={handleToggleReminders}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: settings.enabled ? "var(--danger-color)" : "var(--success-color)",
            }}
          >
            {settings.enabled ? <BellOff size={20} /> : <Bell size={20} />}
            {settings.enabled ? "Disable All" : "Enable All"}
          </button>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            Set up periodic reminders to take care of your health while working. Stay hydrated, stretch regularly, and rest your eyes.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {settings.reminders.map((reminder) => (
            <div
              key={reminder.id}
              style={{
                padding: "1rem",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
                opacity: reminder.enabled ? 1 : 0.5,
              }}
            >
              {editingId === reminder.id ? (
                <div>
                  <div className="form-group">
                    <label>Interval (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="480"
                      value={editInterval}
                      onChange={(e) => setEditInterval(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <input
                      type="text"
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleSaveEdit(reminder.id)}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <Check size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>{getReminderIcon(reminder.reminder_type)}</span>
                      <span style={{ fontWeight: "bold" }}>{reminder.reminder_type}</span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "var(--accent-color)",
                          color: "white",
                          borderRadius: "12px",
                        }}
                      >
                        Every {reminder.interval_minutes}m
                      </span>
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      {reminder.message}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleStartEdit(reminder)}
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "var(--bg-tertiary)",
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleReminder(reminder.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        backgroundColor: reminder.enabled ? "var(--warning-color)" : "var(--success-color)",
                      }}
                    >
                      {reminder.enabled ? "Disable" : "Enable"}
                    </button>
                    {reminder.reminder_type === "Custom" && (
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "var(--danger-color)",
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem" }}>
          {showAddForm ? (
            <div style={{ padding: "1rem", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
              <h4 style={{ marginBottom: "1rem" }}>Add Custom Reminder</h4>
              <div className="form-group">
                <label>Interval (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={newReminder.interval}
                  onChange={(e) => setNewReminder({ ...newReminder, interval: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <input
                  type="text"
                  placeholder="e.g., Take a quick walk around the room"
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handleAddCustomReminder}>Add Reminder</button>
                <button onClick={() => setShowAddForm(false)} style={{ backgroundColor: "var(--bg-tertiary)" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}
            >
              <Plus size={20} />
              Add Custom Reminder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
