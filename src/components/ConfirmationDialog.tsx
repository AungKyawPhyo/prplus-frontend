import React from "react";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const dialogStyle: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#111",
  color: "#fff",
  padding: "20px",
  borderRadius: "8px",
  zIndex: 999,
  textAlign: "center",
  width: "300px",
};

export default function ConfirmationDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!open) return null;
  return (
    <div style={dialogStyle}>
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={onConfirm} style={{ marginRight: "10px" }}>
        Yes
      </button>
      <button onClick={onCancel}>No</button>
    </div>
  );
}