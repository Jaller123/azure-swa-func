import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const loadMessage = async () => {
      try {
        const res = await fetch("/api/hello");   // ✅ this is the correct location
        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        setMessage("Failed to call API");
        console.error(err);
      }
    };

    loadMessage();
  }, []);

  return (
    <main>
      <h1>Azure SWA + Functions</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;
