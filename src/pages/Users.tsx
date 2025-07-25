import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation, ApolloError } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ConfirmationDialog from "../components/ConfirmationDialog";

const GET_USERS = gql`
  query GetUsers($page: Int!, $size: Int!, $name: String, $role: String) {
    getUsers(page: $page, size: $size, name: $name, role: $role) {
      users {
        id
        name
        role
        created_date
        updated_date
        created_by { name }
        updated_by { name }
      }
      totalCount
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

export default function Users() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { page, size: 10, name, role },
    fetchPolicy: "network-only",
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setDialogOpen(false);
      refetch();
    },
    onError: (err) => {
      if (err instanceof ApolloError && err.graphQLErrors.length > 0) {
        alert(err.graphQLErrors[0].message);
      } else {
        alert("Error deleting user");
      }
      setDialogOpen(false);
    },
  });

  useEffect(() => {
    const delay = setTimeout(() => setName(pendingName), 700);
    return () => clearTimeout(delay);
  }, [pendingName]);

  if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error loading users</p>;

  const users = data?.getUsers?.users || [];
  const totalCount = data?.getUsers?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>User Management</h2>
        <button style={styles.createBtn} onClick={() => navigate("/user/new")}>
          + Create
        </button>
      </div>
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name"
          value={pendingName}
          onChange={(e) => setPendingName(e.target.value)}
          style={styles.input}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
          <option value="">All Roles</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Created Date</th>
            <th style={styles.th}>Updated Date</th>
            <th style={styles.th}>Created By</th>
            <th style={styles.th}>Updated By</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id} style={styles.tr}>
              <td style={styles.td}>{u.name}</td>
              <td style={styles.td}>{u.role}</td>
              <td style={styles.td}>
                {u.created_date && dayjs(u.created_date).isValid()
                  ? dayjs(u.created_date).format("YYYY-MM-DD")
                  : "-"}
              </td>
              <td style={styles.td}>
                {u.updated_date && dayjs(u.updated_date).isValid()
                  ? dayjs(u.updated_date).format("YYYY-MM-DD")
                  : "-"}
              </td>
              <td style={styles.td}>{u.created_by?.name || "-"}</td>
              <td style={styles.td}>{u.updated_by?.name || "-"}</td>
              <td style={styles.td}>
                <button style={styles.iconBtn} onClick={() => navigate(`/user/${u.id}`)}>✏️</button>
                <button
                  style={styles.iconBtn}
                  onClick={() => {
                    setSelectedId(u.id);
                    setDialogOpen(true);
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span style={styles.pageText}>Page {page}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        onConfirm={() => selectedId && deleteUser({ variables: { id: selectedId } })}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    background: "linear-gradient(140deg,#ffbf02,#dd7802)",
    minHeight: "100vh",
  },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  title: {
    color: "#FFD700",            // ✅ Text Yellow
    background: "#000",          // ✅ Background Black
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  createBtn: {
    background: "#000",          // ✅ Background Black
    color: "#FFD700",            // ✅ Text Yellow
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  filters: { display: "flex", gap: "10px", marginBottom: "10px" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: "1" },
  table: { width: "100%", borderCollapse: "collapse", background: "#111", color: "#fff" },
  th: { padding: "10px", background: "#222", textAlign: "center" },
  td: { padding: "10px", textAlign: "center" },
  tr: { borderBottom: "1px solid #444" },
  pagination: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  pageText: { fontWeight: "bold", color: "#000" },
  iconBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    margin: "0 3px",
  },
};