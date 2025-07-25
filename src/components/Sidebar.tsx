import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo/pr-plus-menu-1.png";

type Props = {
  onLogout: () => void;
};

const Sidebar: React.FC<Props> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Users", path: "/users" },
    { name: "Events", path: "/events" },
    { name: "Change Password", path: "/change-password" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <div style={styles.separator} />
        <p style={styles.powered}>Powered by IBN</p>
      </div>

      <div style={styles.menu}>
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.menuItem,
              backgroundColor: isActive(item.path) ? "#FFD700" : "transparent",
              color: isActive(item.path) ? "#000" : "#FFD700",
              fontWeight: isActive(item.path) ? "bold" : "normal",
            }}
          >
            {item.name}
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "220px",
    backgroundColor: "#000", // ✅ Black background
    color: "#FFD700", // ✅ Yellow text
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 10px",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logo: {
    maxWidth: "140px",
    height: "auto",
  },
  separator: {
    height: "1px",
    backgroundColor: "#FFD700",
    margin: "10px 0",
  },
  powered: {
    color: "#FFD700",
    fontSize: "13px",
    fontStyle: "italic",
  },
  menu: {
    flexGrow: 1,
    marginTop: "20px",
  },
  menuItem: {
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "background 0.3s",
  },
  footer: {
    marginTop: "20px",
  },
  logoutButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#FFD700",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Sidebar;