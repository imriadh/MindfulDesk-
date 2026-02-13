import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Shield, ShieldOff, Plus, X, AlertTriangle, Clock } from "lucide-react";
import { StorageManager, STORAGE_KEYS } from "../utils/storage";
import LoadingSpinner from "./LoadingSpinner";

interface BlockedItem {
  id: string;
  name: string;
  url_pattern: string;
  item_type: "Website" | "Application";
  is_active: boolean;
}

interface BlockerSettings {
  enabled: boolean;
  block_mode: "Warn" | "Block";
  blocked_items: BlockedItem[];
  allow_override: boolean;
  override_timeout: number;
}

export default function DistractionBlocker() {
  const [settings, setSettings] = useState<BlockerSettings | null>(null);
  const [newItem, setNewItem] = useState({ name: "", url: "" });
  const [popularSites, setPopularSites] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [overrideActive, setOverrideActive] = useState(false);
  const [overrideTimer, setOverrideTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    loadPopularSites();
  }, []);

  useEffect(() => {
    // Persist settings to localStorage whenever they change
    if (settings) {
      StorageManager.save(STORAGE_KEYS.BLOCKER_SETTINGS, settings);
    }
  }, [settings]);

  useEffect(() => {
    if (overrideActive && overrideTimer > 0) {
      const timer = setTimeout(() => {
        setOverrideTimer(overrideTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (overrideActive && overrideTimer === 0) {
      handleEndOverride();
    }
  }, [overrideActive, overrideTimer]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // Try to load from backend
      const result = await invoke<BlockerSettings>("get_blocker_settings");
      setSettings(result);
    } catch (error) {
      console.error("Failed to load blocker settings from backend:", error);
      // Fallback to localStorage
      const cached = StorageManager.load<BlockerSettings | null>(
        STORAGE_KEYS.BLOCKER_SETTINGS,
        null
      );
      if (cached) {
        setSettings(cached);
      } else {
        // Use default settings
        setSettings({
          enabled: false,
          block_mode: "Warn",
          blocked_items: [],
          allow_override: true,
          override_timeout: 300,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadPopularSites = async () => {
    try {
      const sites = await invoke<string[]>("get_popular_distractions");
      setPopularSites(sites);
    } catch (error) {
      console.error("Failed to load popular sites:", error);
    }
  };

  const handleToggleBlocker = async () => {
    if (!settings) return;
    const newSettings = { ...settings, enabled: !settings.enabled };
    try {
      await invoke("update_blocker_settings", { settings: newSettings });
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to update blocker:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.url) return;
    try {
      await invoke("add_blocked_item", {
        name: newItem.name,
        urlPattern: newItem.url,
        itemType: "website",
      });
      setNewItem({ name: "", url: "" });
      setShowAddForm(false);
      loadSettings();
    } catch (error) {
      console.error("Failed to add blocked item:", error);
    }
  };

  const handleAddPopular = async (url: string) => {
    const name = url.replace(".com", "").replace(".tv", "");
    try {
      await invoke("add_blocked_item", {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        urlPattern: url,
        itemType: "website",
      });
      loadSettings();
    } catch (error) {
      console.error("Failed to add popular site:", error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await invoke("remove_blocked_item", { id });
      loadSettings();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleToggleItem = async (id: string) => {
    try {
      await invoke("toggle_blocked_item", { id });
      loadSettings();
    } catch (error) {
      console.error("Failed to toggle item:", error);
    }
  };

  const handleRequestOverride = async () => {
    try {
      const success = await invoke<boolean>("request_override", { duration: 300 });
      if (success) {
        setOverrideActive(true);
        setOverrideTimer(settings?.override_timeout || 300);
      }
    } catch (error) {
      console.error("Failed to request override:", error);
    }
  };

  const handleEndOverride = async () => {
    try {
      await invoke("end_override");
      setOverrideActive(false);
      setOverrideTimer(0);
    } catch (error) {
      console.error("Failed to end override:", error);
    }
  };

  if (!settings) return <div>Loading...</div>;

  if (isLoading) {
    return <LoadingSpinner message="Loading blocker settings..." />;
  }

  if (!settings) {
    return (
      <div className="card">
        <p style={{ color: 'var(--text-secondary)' }}>
          Failed to load distraction blocker settings.
        </p>
        <button onClick={loadSettings}>Retry</button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2>🛡️ Distraction Blocker</h2>
          <button
            onClick={handleToggleBlocker}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: settings.enabled ? "var(--danger-color)" : "var(--success-color)",
            }}
          >
            {settings.enabled ? <ShieldOff size={20} /> : <Shield size={20} />}
            {settings.enabled ? "Disable" : "Enable"}
          </button>
        </div>

        {overrideActive && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "var(--warning-color)",
              color: "white",
              borderRadius: "8px",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Clock size={20} style={{ display: "inline", marginRight: "0.5rem" }} />
              Override active: {formatTime(overrideTimer)}
            </div>
            <button onClick={handleEndOverride} style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
              End Now
            </button>
          </div>
        )}

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Block distracting websites and apps during focus sessions. Stay productive and on track.
          </p>

          {settings.enabled && !overrideActive && (
            <button
              onClick={handleRequestOverride}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "var(--warning-color)",
              }}
            >
              <AlertTriangle size={20} />
              Request 5-min Override
            </button>
          )}
        </div>

        <h3 style={{ marginBottom: "1rem" }}>Blocked Items ({settings.blocked_items.length})</h3>
        
        {settings.blocked_items.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontStyle: "italic", marginBottom: "1rem" }}>
            No blocked items yet. Add some to get started!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            {settings.blocked_items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "8px",
                  opacity: item.is_active ? 1 : 0.5,
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    {item.url_pattern}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      backgroundColor: item.is_active ? "var(--warning-color)" : "var(--success-color)",
                    }}
                  >
                    {item.is_active ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "var(--danger-color)",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddForm ? (
          <div style={{ padding: "1rem", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
            <h4 style={{ marginBottom: "1rem" }}>Add New Item</h4>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="e.g., YouTube"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>URL Pattern</label>
              <input
                type="text"
                placeholder="e.g., youtube.com"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleAddItem}>Add Item</button>
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
            Add Blocked Item
          </button>
        )}

        <div style={{ marginTop: "2rem" }}>
          <h4 style={{ marginBottom: "1rem" }}>Quick Add Popular Sites</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {popularSites
              .filter((site) => !settings.blocked_items.some((item) => item.url_pattern === site))
              .map((site) => (
                <button
                  key={site}
                  onClick={() => handleAddPopular(site)}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  + {site}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
