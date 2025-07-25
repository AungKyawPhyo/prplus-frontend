import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery, ApolloError } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

const CREATE_USER = gql`
  mutation CreateUser($input: UserCreateInput!) {
    createUser(input: $input) {
      id
      name
      role
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      role
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: Int!) {
    getUserById(id: $id) {
      id
      name
      role
    }
  }
`;

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    role: "staff",
    password: "",
  });

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const { data } = useQuery(GET_USER_BY_ID, {
    variables: { id: parseInt(id!) },
    skip: !isEdit, // only run when editing
    fetchPolicy: "network-only",
  });

  // ✅ Pre-fill form when editing
  useEffect(() => {
    if (data?.getUserById) {
      const { name, role } = data.getUserById;
      setFormData((prev) => ({ ...prev, name, role }));
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateUser({
          variables: {
            id: parseInt(id!),
            input: { name: formData.name, role: formData.role },
          },
        });
        alert("User updated successfully");
      } else {
        const res = await createUser({ variables: { input: formData } });
        const createdUser = res.data?.createUser;
        if (createdUser && createdUser.id) {
          alert(`User '${createdUser.name}' created successfully`);
        } else {
          alert("User created successfully");
        }
      }
      navigate("/users");
    } catch (err) {
      console.error(err);
      if (err instanceof ApolloError && err.graphQLErrors.length > 0) {
        alert(err.graphQLErrors[0].message);
      } else {
        alert("Error saving user");
      }
    }
  };

  const handleCancel = () => {
    if (isEdit && data?.getUserById) {
      const { name, role } = data.getUserById;
      setFormData({ name, role, password: "" }); // reset to original values
    } else {
      setFormData({ name: "", role: "staff", password: "" });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{isEdit ? "Edit User" : "Create New User"}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Name:<span style={styles.required}>*</span></label>
        <input
          style={styles.input}
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <label style={styles.label}>Role:<span style={styles.required}>*</span></label>
        <select
          style={styles.input}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>

        {!isEdit && (
          <>
            <label style={styles.label}>Password:<span style={styles.required}>*</span></label>
            <input
              style={styles.input}
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </>
        )}

        <div style={styles.buttonRow}>
          <button type="submit" style={styles.button}>
            {isEdit ? "Update User" : "Create User"}
          </button>
          <button type="button" style={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
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
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
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
  required: { color: "red", marginLeft: "4px" }, // 🔴 Red asterisk
};