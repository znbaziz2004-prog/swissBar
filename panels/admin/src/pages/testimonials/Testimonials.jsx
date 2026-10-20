
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/barber-testimonials");
      const data = response.data?.data?.testimonials ?? [];

      setTestimonials(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load testimonials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setProcessingId(id);
      setError("");

      await api.patch(`/admin/barber-testimonials/${id}/status`, {
        status,
        admin_feedback: feedback[id] || "",
      });

      await loadTestimonials();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update testimonial status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const statusStyle = (status) => {
    const styles = {
      pending: {
        background: "#fff3cd",
        color: "#856404",
      },
      approved: {
        background: "#d1fae5",
        color: "#065f46",
      },
      rejected: {
        background: "#fee2e2",
        color: "#991b1b",
      },
    };

    return {
      ...styles[status],
      padding: "5px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      textTransform: "capitalize",
      display: "inline-block",
    };
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Barber Testimonials</h1>
          <p style={{ color: "#64748b", marginTop: 8 }}>
            Review testimonials submitted by barbershop owners.
          </p>
        </div>

        <button
          onClick={loadTestimonials}
          style={{
            padding: "10px 16px",
            border: "1px solid #dbe3ec",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: 14,
            marginBottom: 18,
            borderRadius: 8,
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: 32,
            textAlign: "center",
          }}
        >
          <h3>No testimonials yet</h3>
          <p style={{ color: "#64748b" }}>
            Submitted testimonials will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {testimonials.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 22,
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>
                    {item.shop_name}
                  </h3>

                  <p style={{ margin: 0, color: "#64748b" }}>
                    Owner: {item.owner_name || "N/A"}
                    {item.owner_email
                      ? ` · ${item.owner_email}`
                      : ""}
                  </p>
                </div>

                <span style={statusStyle(item.status)}>
                  {item.status}
                </span>
              </div>

              <blockquote
                style={{
                  margin: "20px 0",
                  padding: "14px 18px",
                  background: "#f8fafc",
                  borderLeft: "4px solid #0f8a73",
                  borderRadius: 6,
                  lineHeight: 1.7,
                }}
              >
                {item.testimonial}
              </blockquote>

              <p style={{ color: "#64748b", fontSize: 13 }}>
                Submitted:{" "}
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "N/A"}
              </p>

              {item.admin_feedback && (
                <p>
                  <strong>Previous feedback:</strong>{" "}
                  {item.admin_feedback}
                </p>
              )}

              {item.status === "pending" && (
                <div style={{ marginTop: 18 }}>
                  <label
                    htmlFor={`feedback-${item.id}`}
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    Admin feedback (optional)
                  </label>

                  <textarea
                    id={`feedback-${item.id}`}
                    value={feedback[item.id] || ""}
                    onChange={(e) =>
                      setFeedback((previous) => ({
                        ...previous,
                        [item.id]: e.target.value,
                      }))
                    }
                    placeholder="Add feedback if needed..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: 12,
                      border: "1px solid #dbe3ec",
                      borderRadius: 8,
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 12,
                    }}
                  >
                    <button
                      disabled={processingId === item.id}
                      onClick={() => updateStatus(item.id, "approved")}
                      style={{
                        padding: "10px 16px",
                        background: "#0f8a73",
                        color: "#fff",
                        border: 0,
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      {processingId === item.id
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      disabled={processingId === item.id}
                      onClick={() => updateStatus(item.id, "rejected")}
                      style={{
                        padding: "10px 16px",
                        background: "#dc2626",
                        color: "#fff",
                        border: 0,
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      {processingId === item.id
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}