import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ConfirmationDialog from "../components/ConfirmationDialog";

const GET_EVENTS = gql`
  query GetEvents($page: Int!, $size: Int!, $name: String, $contact: String, $venue: String, $dateFrom: String, $dateTo: String) {
    getEvents(page: $page, size: $size, name: $name, contact: $contact, venue: $venue, dateFrom: $dateFrom, dateTo: $dateTo) {
      events {
        id
        name
        contact
        venue
        description
        event_date
        created_by { name }
        updated_by { name }
      }
      totalCount
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($id: Int!) {
    deleteEvent(id: $id)
  }
`;

export default function Events() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  // ✅ Input fields for typing
  const [nameInput, setNameInput] = useState("");
  const [contactInput, setContactInput] = useState("");
  const [venueInput, setVenueInput] = useState("");
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");

  // ✅ Actual filters for query
  const [filters, setFilters] = useState({
    name: "",
    contact: "",
    venue: "",
    dateFrom: "",
    dateTo: ""
  });

  const { data, loading, error, refetch } = useQuery(GET_EVENTS, {
    variables: { page, size: 10, ...filters },
    fetchPolicy: "network-only",
  });

  const [deleteEvent] = useMutation(DELETE_EVENT, {
    onCompleted: () => {
      setDialogOpen(false);
      refetch();
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ Debounce filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({
        name: nameInput,
        contact: contactInput,
        venue: venueInput,
        dateFrom: dateFromInput,
        dateTo: dateToInput
      });
    }, 700);

    return () => clearTimeout(handler);
  }, [nameInput, contactInput, venueInput, dateFromInput, dateToInput, page]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error loading events</p>;

  const events = data?.getEvents?.events || [];
  const totalCount = data?.getEvents?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Event Management</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={styles.createBtn} onClick={() => navigate("/event/new")}>
            + Create
          </button>
          <button
            style={styles.createBtn}
            onClick={() => {
              sessionStorage.setItem("monitorEvents", JSON.stringify(events));

              const newWindow = window.open("/event-monitor", "_blank");

              // ✅ Optional: try requesting fullscreen automatically
              if (newWindow) {
                newWindow.onload = () => {
                  newWindow.document.documentElement.requestFullscreen?.();
                };
              }
            }}
            disabled={events.length === 0}
          >
            Display Event to Monitor
          </button>
        </div>
      </div>

      <div style={styles.filters}>
        <input placeholder="Name" value={nameInput} onChange={e => setNameInput(e.target.value)} style={styles.input} />
        <input placeholder="Contact" value={contactInput} onChange={e => setContactInput(e.target.value)} style={styles.input} />
        <input placeholder="Venue" value={venueInput} onChange={e => setVenueInput(e.target.value)} style={styles.input} />

        <div style={styles.dateFilter}>
          <label style={styles.dateLabel}>From Date</label>
          <input type="date" value={dateFromInput} onChange={e => setDateFromInput(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.dateFilter}>
          <label style={styles.dateLabel}>To Date</label>
          <input type="date" value={dateToInput} onChange={e => setDateToInput(e.target.value)} style={styles.input} />
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Contact</th>
            <th style={styles.th}>Venue</th>
            <th style={styles.th}>Event Date</th>
            <th style={styles.th}>Created By</th>
            <th style={styles.th}>Updated By</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e: any) => (
            <tr key={e.id} style={styles.tr}>
              <td style={styles.td}>{e.name}</td>
              <td style={styles.td}>{e.contact || "-"}</td>
              <td style={styles.td}>{e.venue || "-"}</td>
              <td style={styles.td}>{e.event_date ? dayjs(e.event_date).format("YYYY-MM-DD") : "-"}</td>
              <td style={styles.td}>{e.created_by?.name || "-"}</td>
              <td style={styles.td}>{e.updated_by?.name || "-"}</td>
              <td style={styles.td}>
                <button style={styles.iconBtn} onClick={() => navigate(`/event/${e.id}`)}>✏️</button>
                <button style={styles.iconBtn} onClick={() => { setSelectedId(e.id); setDialogOpen(true); }}>🗑️</button>
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
        message="Are you sure you want to delete this event?"
        onConfirm={async () => {
          if (!selectedId) return;
          try {
            await deleteEvent({ variables: { id: selectedId } });
          } catch (err: any) {
            if (err.graphQLErrors?.length > 0) {
              alert(err.graphQLErrors[0].message);  // ✅ show backend error message
            } else {
              alert("Error deleting event");
            }
          }
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: "20px", background: "linear-gradient(140deg,#ffbf02,#dd7802)", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  title: { color: "#FFD700", background: "#000", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold" },
  createBtn: { background: "#000", color: "#FFD700", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  filters: { display: "flex", gap: "10px", marginBottom: "10px" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: "1" },
  table: { width: "100%", borderCollapse: "collapse", background: "#111", color: "#fff" },
  th: { padding: "10px", background: "#222" },
  td: { padding: "10px", textAlign: "center" },
  tr: { borderBottom: "1px solid #444" },
  pagination: { marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" },
  pageText: { fontWeight: "bold", color: "#000" },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" },
  dateFilter: { display: "flex", flexDirection: "column", flex: "1" },
  dateLabel: { color: "#000", fontWeight: "bold", marginBottom: "3px", fontSize: "12px" },
};