import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Dashboard from "./components/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on app start
    invoke("init_database")
      .then(() => {
        console.log("Database initialized");
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error("Failed to initialize database:", error);
        setIsInitialized(true); // Continue anyway
      });
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <div>Loading MindfulDesk...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
