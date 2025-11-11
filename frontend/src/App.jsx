import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("…loading");

  useEffect(() => {
    // In Azure Static Web Apps, Functions are auto-mounted at /api/*
    fetch("/api/hello")
      .then(r => r.json())
      .then(d => setMsg(d.message))
      .catch(() => setMsg("Failed to call API"));
  }, []);

  return (
    <main style={{fontFamily: "system-ui", padding: 24}}>
      <h1>Azure SWA + Functions</h1>
      <p>API says: <strong>{msg}</strong></p>
    </main>
  );
}

export default App;
