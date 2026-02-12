import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { Play, Pause, Square, Coffee, Brain } from "lucide-react";

interface FocusState {
  is_active: boolean;
  is_paused: boolean;
  session_type: "Focus" | "ShortBreak" | "LongBreak";
  remaining_seconds: number;
  total_seconds: number;
  completed_sessions: number;
}

const motivationalQuotes = [
  "Take a deep breath. You've earned this break.",
  "Rest is not idleness. Recharge your mind.",
  "Your eyes will thank you for this break.",
  "Hydrate and stretch. Your body needs care too.",
  "Great work! A break makes you more productive.",
  "Step away from the screen. Clarity awaits.",
];

export default function FocusTab() {
  const [focusState, setFocusState] = useState<FocusState>({
    is_active: false,
    is_paused: false,
    session_type: "Focus",
    remaining_seconds: 1500,
    total_seconds: 1500,
    completed_sessions: 0,
  });
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Timer countdown
    let interval: number | undefined;

    if (focusState.is_active && !focusState.is_paused && focusState.remaining_seconds > 0) {
      interval = setInterval(() => {
        setFocusState((prev) => ({
          ...prev,
          remaining_seconds: Math.max(0, prev.remaining_seconds - 1),
        }));
      }, 1000);
    }

    // Session complete
    if (focusState.is_active && focusState.remaining_seconds === 0) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusState.is_active, focusState.is_paused, focusState.remaining_seconds]);

  const handleSessionComplete = async () => {
    const sessionType = focusState.session_type;
    
    // Show notification
    try {
      if (sessionType === "Focus") {
        await sendNotification({
          title: "Focus Session Complete! 🎉",
          body: "Time for a well-deserved break!",
        });
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      } else {
        await sendNotification({
          title: "Break Complete! ⚡",
          body: "Ready to focus again?",
        });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }

    // Stop the current session
    await invoke("stop_focus_session");
    
    // Update state
    setFocusState((prev) => ({
      ...prev,
      is_active: false,
      remaining_seconds: 0,
    }));
  };

  const startSession = async (type: "focus" | "short_break" | "long_break") => {
    try {
      const result = await invoke<FocusState>("start_focus_session", {
        sessionType: type,
      });
      setFocusState(result);
      setQuote("");
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  const pauseSession = async () => {
    try {
      const result = await invoke<FocusState>("pause_focus_session");
      setFocusState(result);
    } catch (error) {
      console.error("Failed to pause session:", error);
    }
  };

  const stopSession = async () => {
    try {
      const result = await invoke<FocusState>("stop_focus_session");
      setFocusState(result);
      setQuote("");
    } catch (error) {
      console.error("Failed to stop session:", error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSessionLabel = () => {
    switch (focusState.session_type) {
      case "Focus":
        return "Focus Session";
      case "ShortBreak":
        return "Short Break";
      case "LongBreak":
        return "Long Break";
      default:
        return "Session";
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          {getSessionLabel()}
        </h2>

        <div className="timer-display">
          {formatTime(focusState.remaining_seconds)}
        </div>

        {quote && (
          <div
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "var(--text-secondary)",
              marginBottom: "2rem",
              padding: "1rem",
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "8px",
            }}
          >
            "{quote}"
          </div>
        )}

        <div className="button-group">
          {!focusState.is_active ? (
            <>
              <button onClick={() => startSession("focus")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Brain size={20} />
                Start Focus (25m)
              </button>
              <button onClick={() => startSession("short_break")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Coffee size={20} />
                Short Break (5m)
              </button>
              <button onClick={() => startSession("long_break")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Coffee size={20} />
                Long Break (15m)
              </button>
            </>
          ) : (
            <>
              <button onClick={pauseSession} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {focusState.is_paused ? <Play size={20} /> : <Pause size={20} />}
                {focusState.is_paused ? "Resume" : "Pause"}
              </button>
              <button onClick={stopSession} style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--danger-color)" }}>
                <Square size={20} />
                Stop
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>
            Sessions Completed Today
          </div>
          <div style={{ fontSize: "3rem", fontWeight: "700", color: "var(--accent-color)" }}>
            {focusState.completed_sessions}
          </div>
        </div>
      </div>

      {/* Quick Reminders */}
      <div className="card" style={{ maxWidth: "600px", margin: "2rem auto" }}>
        <h3 style={{ marginBottom: "1rem" }}>💡 Quick Reminders</h3>
        <ul style={{ lineHeight: "1.8", paddingLeft: "1.5rem", color: "var(--text-secondary)" }}>
          <li>💧 Drink water every hour</li>
          <li>👀 Follow the 20-20-20 rule (every 20 min, look 20 feet away for 20 sec)</li>
          <li>🧘 Stretch during breaks</li>
          <li>🚶 Take a short walk</li>
          <li>🌬️ Practice deep breathing</li>
        </ul>
      </div>
    </div>
  );
}
