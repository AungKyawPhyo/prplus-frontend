import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery, ApolloError } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

const CREATE_EVENT = gql`
  mutation CreateEvent($input: EventInput!) {
    createEvent(input: $input) {
      id
      name
    }
  }
`;

const BULK_CREATE_EVENTS = gql`
  mutation BulkCreateEvents($events: [EventInput!]!) {
    bulkCreateEvents(events: $events)
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: Int!, $input: EventUpdateInput!) {
    updateEvent(id: $id, input: $input) {
      id
      name
    }
  }
`;

const GET_EVENT = gql`
  query GetEventById($id: Int!) {
    getEventById(id: $id) {
      id
      name
      contact
      venue
      description
      event_date
    }
  }
`;

export default function EventForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        venue: "",
        description: "",
        event_date: "",
    });

    const [csvEvents, setCsvEvents] = useState<any[]>([]);
    const [csvPreview, setCsvPreview] = useState(false);

    const [createEvent] = useMutation(CREATE_EVENT);
    const [bulkCreateEvents] = useMutation(BULK_CREATE_EVENTS);
    const [updateEvent] = useMutation(UPDATE_EVENT);

    const { data } = useQuery(GET_EVENT, {
        variables: { id: parseInt(id || "0") },
        skip: !isEdit,
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (isEdit && data?.getEventById) {
            const e = data.getEventById;

            let dateValue = "";
            if (e.event_date) {
                // ✅ Convert to string and slice YYYY-MM-DD
                const raw = String(e.event_date);
                dateValue = raw.includes("T") ? raw.split("T")[0] : raw.substring(0, 10);
            }

            setFormData({
                name: e.name,
                contact: e.contact || "",
                venue: e.venue || "",
                description: e.description || "",
                event_date: dateValue, // ✅ Always YYYY-MM-DD
            });
        }
    }, [data, isEdit]);

    // ✅ CSV Upload handler
    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            const rows = text.split("\n").map((r) => r.trim()).filter((r) => r);
            const events = rows.slice(1).map((r) => {
                const cols = r.split(",");
                return {
                    name: cols[0] || "",
                    contact: cols[1] || "",
                    venue: cols[2] || "",
                    description: cols[3] || "",
                    event_date: cols[4] || "",
                };
            });
            setCsvEvents(events);
            setCsvPreview(true);
        };
        reader.readAsText(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // ✅ Validate CSV rows if bulk import
            if (csvEvents.length > 0) {
                for (let i = 0; i < csvEvents.length; i++) {
                    const ev = csvEvents[i];
                    if (!ev.name.trim() || !ev.event_date.trim()) {
                        alert(`Row ${i + 1}: "Name" and "Event Date" are required.`);
                        return; // stop submission
                    }
                }

                await bulkCreateEvents({ variables: { events: csvEvents } });
                alert("Events imported successfully");
            } else if (isEdit) {
                await updateEvent({ variables: { id: parseInt(id!), input: formData } });
                alert("Event updated successfully");
            } else {
                await createEvent({ variables: { input: formData } });
                alert("Event created successfully");
            }

            navigate("/events");
        } catch (err) {
            console.error(err);
            if (err instanceof ApolloError && err.graphQLErrors.length > 0) {
                alert(err.graphQLErrors[0].message);
            } else {
                alert("Error saving event(s)");
            }
        }
    };

    const handleCancel = () => {
        if (csvPreview || csvEvents.length > 0) {
            // ✅ Clear CSV preview and reset to empty create form
            setCsvEvents([]);
            setCsvPreview(false);
            setFormData({
                name: "",
                contact: "",
                venue: "",
                description: "",
                event_date: "",
            });
            return;
        }

        if (isEdit && data?.getEventById) {
            const e = data.getEventById;
            setFormData({
                name: e.name,
                contact: e.contact || "",
                venue: e.venue || "",
                description: e.description || "",
                event_date: e.event_date?.split("T")[0] || "",
            });
        } else {
            setFormData({
                name: "",
                contact: "",
                venue: "",
                description: "",
                event_date: "",
            });
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{isEdit ? "Edit Event" : "Create New Event"}</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                {!csvPreview && (
                    <>
                        <label style={styles.label}>Name:<span style={styles.required}>*</span></label>
                        <input
                            style={styles.input}
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required={!csvEvents.length}
                        />

                        <label style={styles.label}>Contact:</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        />

                        <label style={styles.label}>Venue:</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={formData.venue}
                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        />

                        <label style={styles.label}>Event Date:<span style={styles.required}>*</span></label>
                        <input
                            style={styles.input}
                            type="date"
                            value={formData.event_date}
                            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                            required={!csvEvents.length}
                        />

                        <label style={styles.label}>Description:</label>
                        <textarea
                            style={styles.textarea}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </>
                )}

                {!isEdit && (
                    <>
                        <label style={styles.label}>Import CSV:</label>
                        <input type="file" accept=".csv" onChange={handleCSVUpload} />
                    </>
                )}
                {!isEdit && csvPreview && (
                    <div style={styles.csvPreview}>
                        <h3>CSV Preview</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th><th>Contact</th><th>Venue</th><th>Description</th><th>Event Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {csvEvents.map((ev, i) => (
                                    <tr key={i}>
                                        <td>{ev.name}</td>
                                        <td>{ev.contact}</td>
                                        <td>{ev.venue}</td>
                                        <td>{ev.description}</td>
                                        <td>{ev.event_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" style={styles.button}>
                        {isEdit ? "Update Event" : csvEvents.length > 0 ? "Import Events" : "Create Event"}
                    </button>
                    <button type="button" style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: "20px", background: "linear-gradient(140deg,#ffbf02,#dd7802)", height: "100vh" },
    title: { display: "inline-block", color: "#FFD700", background: "#000", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold" },
    form: { display: "flex", flexDirection: "column", maxWidth: "700px", marginTop: "20px" }, // ✅ increased width
    label: { marginTop: "10px", color: "#000" },
    input: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc" },
    textarea: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc", minHeight: "80px" },
    button: { marginTop: "20px", background: "#000", color: "#FFD700", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    cancelBtn: { marginTop: "20px", background: "#777", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    csvPreview: {
        marginTop: "20px",
        background: "#fff",
        padding: "15px",
        borderRadius: "6px",
        maxWidth: "90%",       // ✅ makes it use 90% of container width
        overflowX: "auto"      // ✅ scroll if too wide
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",      // ✅ slightly larger text
        tableLayout: "auto",    // ✅ allow cells to expand naturally
        textAlign: "center"
    },
    required: { color: "red", marginLeft: "4px" },
};