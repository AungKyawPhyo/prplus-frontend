import React, { useState } from "react";
import { gql, useMutation, ApolloError } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [changePassword] = useMutation(CHANGE_PASSWORD);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }

    try {
      await changePassword({
        variables: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
      });

      alert("Password changed successfully. Please login again.");

      // ✅ Clear token & enforce re-login
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      if (err instanceof ApolloError && err.graphQLErrors.length > 0) {
        alert(err.graphQLErrors[0].message);
      } else {
        alert("Error changing password.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const toggleShow = (field: "current" | "new" | "confirm") => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Change Password</h2>
      <form onSubmit={handleSave} style={styles.form}>
        <label style={styles.label}>
          Current Password:<span style={styles.required}>*</span>
        </label>
        <div style={styles.passwordWrapper}>
          <input
            style={styles.input}
            type={show.current ? "text" : "password"}
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            required
          />
          <button type="button" style={styles.showBtn} onClick={() => toggleShow("current")}>
            {show.current ? "Hide" : "Show"}
          </button>
        </div>

        <label style={styles.label}>
          New Password:<span style={styles.required}>*</span>
        </label>
        <div style={styles.passwordWrapper}>
          <input
            style={styles.input}
            type={show.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
          />
          <button type="button" style={styles.showBtn} onClick={() => toggleShow("new")}>
            {show.new ? "Hide" : "Show"}
          </button>
        </div>

        <label style={styles.label}>
          Confirm New Password:<span style={styles.required}>*</span>
        </label>
        <div style={styles.passwordWrapper}>
          <input
            style={styles.input}
            type={show.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <button type="button" style={styles.showBtn} onClick={() => toggleShow("confirm")}>
            {show.confirm ? "Hide" : "Show"}
          </button>
        </div>

        <div style={styles.buttonRow}>
          <button type="submit" style={styles.button}>Save</button>
          <button type="button" style={styles.cancelButton} onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    background: "linear-gradient(140deg,#ffbf02,#dd7802)",
    height: "100vh",
  },
  title: {
    color: "#FFD700",
    background: "#000",
    padding: "8px 16px",
    borderRadius: "6px",
    display: "inline-block",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    marginTop: "20px",
  },
  label: { marginTop: "10px", color: "#000" },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  showBtn: {
    padding: "6px 10px",
    background: "#000",
    color: "#FFD700",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonRow: { display: "flex", gap: "10px", marginTop: "20px" },
  button: {
    background: "#000",
    color: "#FFD700",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    flex: 1,
  },
  cancelButton: {
    background: "#444",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    flex: 1,
  },
  required: { color: "red", marginLeft: "4px" },
};