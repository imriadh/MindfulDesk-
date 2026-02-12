import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import FocusTab from "./FocusTab";
import StatsTab from "./StatsTab";
import JournalTab from "./JournalTab";
import SettingsTab from "./SettingsTab";
import { Sun, Moon } from "lucide-react";

type TabType = "focus" | "stats" | "journal" | "settings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("focus");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="header">
        <h1>🧘 MindfulDesk</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </header>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "focus" ? "active" : ""}`}
          onClick={() => setActiveTab("focus")}
        >
          Focus
        </button>
        <button
          className={`tab-button ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>
        <button
          className={`tab-button ${activeTab === "journal" ? "active" : ""}`}
          onClick={() => setActiveTab("journal")}
        >
          Journal
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      <div className="content">
        {activeTab === "focus" && <FocusTab />}
        {activeTab === "stats" && <StatsTab />}
        {activeTab === "journal" && <JournalTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
