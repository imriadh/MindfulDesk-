import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Dashboard from "./components/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { ensureNotificationPermission } from "./utils/notifications";
import "./App.css";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await invoke("init_database");
      console.log("Database initialized");
      
      // Check notification permissions
      await ensureNotificationPermission();
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize app:", error);
      setInitError(error instanceof Error ? error.message : String(error));
      // Continue anyway for development
      setIsInitialized(true);
    }
  };

  if (initError) {
    console.warn("App initialized with errors:", initError);
  }

  if (!isInitialized) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <LoadingSpinner size="large" message="Initializing MindfulDesk..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
