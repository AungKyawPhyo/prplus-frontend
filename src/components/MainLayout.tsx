import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      <Sidebar onLogout={handleLogout} />
      <main style={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, Helvetica Neue, Roboto, sans-serif",
    background: "#f0f0f0",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#fff",
  },
};

export default MainLayout;