import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import prplusLogo from "../assets/logo/pr-plus-menu-1.png";

export default function EventMonitor() {
  const location = useLocation();
  const savedEvents = sessionStorage.getItem("monitorEvents");
  const events = savedEvents ? JSON.parse(savedEvents) : [];

  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={prplusLogo} alt="PRPLUS Logo" style={styles.logo} />
        <p style={styles.powered}>Powered by IBN</p>
        <h2 style={styles.heading}>Event Information</h2>

        {events.length === 0 ? (
          <p style={styles.noData}>No events to display</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Venue</th>
                <th style={styles.th}>Event Date</th>
                <th style={styles.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e: any) => (
                <tr key={e.id} style={styles.tr}>
                  <td style={styles.td}>{e.name}</td>
                  <td style={styles.td}>{e.contact || "-"}</td>
                  <td style={styles.td}>{e.venue || "-"}</td>
                  <td style={styles.td}>{e.event_date?.split("T")[0] || "-"}</td>
                  <td style={styles.td}>{e.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Fullscreen button outside black card */}
      {!isFullscreen && events.length > 0 && (
        <div style={styles.fullscreenWrapper}>
          <button style={styles.fullscreenBtn} onClick={enterFullscreen}>
            🔲 Fullscreen
          </button>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "linear-gradient(140deg, #ffbf02 0%, #dd7802 100%)",
    minHeight: "100vh",
    width: "100vw",
    fontFamily: "Segoe UI, Helvetica Neue, Roboto, sans-serif",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    background: "#111111",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 30px rgba(0,0,0,0.4)",
    width: "95%",
    maxWidth: "1200px",
    color: "#fff",
    marginBottom: "20px", // ✅ gap between table and yellow button
  },
  logo: { width: "100px", display: "block", margin: "0 auto" },
  powered: {
    color: "#F6BE00",
    fontSize: "13px",
    textAlign: "center",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  heading: {
    textAlign: "center",
    color: "#FFD700",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#222",
    color: "#fff",
  },
  th: {
    padding: "10px",
    background: "#333",
    color: "#FFD700",
    textAlign: "center",
  },
  td: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #fff",
  },
  tr: { borderBottom: "1px solid #fff" },
  noData: {
    textAlign: "center",
    color: "#FFD700",
    fontWeight: "bold",
    marginTop: "20px",
  },
  fullscreenWrapper: {
    textAlign: "center",
  },
  fullscreenBtn: {
    padding: "12px 24px",
    background: "#FFD700",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
};