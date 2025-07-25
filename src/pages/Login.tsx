import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import prplusLogo from "../assets/logo/pr-plus-menu-1.png";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // ✅ State for inline error
  const navigate = useNavigate();
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); // Clear previous error
    try {
      const res = await login({ variables: { username, password } });

      if (!res.data.login) {
        setLoginError("Invalid username or password"); // ✅ Show inline error
        return;
      }

      localStorage.setItem("token", res.data.login);
      navigate("/users");
    } catch (err: any) {
      const gqlError =
        err.graphQLErrors?.[0]?.message || "Login failed. Please try again.";
      setLoginError(gqlError); // ✅ Display backend message inline
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={prplusLogo} alt="PRPLUS Logo" style={styles.logo} />
        <p style={styles.powered}>Powered by IBN</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* ✅ Inline error message */}
          {loginError && <p style={styles.error}>{loginError}</p>}
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "linear-gradient(140deg, #ffbf02 0%, #dd7802 100%)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, Helvetica Neue, Roboto, sans-serif",
  },
  card: {
    background: "#111111",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 0 30px rgba(0,0,0,0.4)",
    width: "350px",
    textAlign: "center",
  },
  logo: {
    width: "100px",
    marginBottom: "10px",
  },
  powered: {
    color: "#F6BE00",
    fontSize: "13px",
    marginTop: "-10px",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#222",
    color: "#fff",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#FFD700",
    color: "#000",
    fontWeight: 600,
    cursor: "pointer",
    transition: "box-shadow 0.3s ease-in-out",
  },
  error: {
    marginTop: "10px",
    color: "red",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default Login;