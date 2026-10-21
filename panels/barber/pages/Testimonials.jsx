
import React, { useEffect, useState } from "react";
import {
  getMyTestimonial,
  submitTestimonial,
} from "../services/barberService";
import { errMsg } from "../services/api";

export default function Testimonials() {
  const [testimonial, setTestimonial] = useState("");
  const [myTestimonial, setMyTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTestimonial = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyTestimonial();
      const data = response?.data?.testimonial ?? null;

      setMyTestimonial(data);
      setTestimonial(
        data?.status === "rejected" ? data.testimonial : ""
      );
      setEditing(false);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonial();
  }, []);

  const handleEdit = () => {
    setTestimonial(myTestimonial?.testimonial || "");
    setEditing(true);
    setError("");
    setMessage("");
  };

  const handleCancel = () => {
    setTestimonial("");
    setEditing(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const text = testimonial.trim();

    if (!text) {
      setError("Please write your testimonial first.");
      return;
    }

    if (text.length > 2000) {
      setError("Testimonial cannot exceed 2000 characters.");
      return;
    }

    try {
      setSubmitting(true);

      await submitTestimonial(text);

      setMessage(
        "Your testimonial has been submitted for Super Admin approval."
      );

      await loadTestimonial();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="card">Loading testimonial...</div>;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Platform Testimonial</h1>
          <p className="muted">
            Share your experience with the Swiss Barber platform.
          </p>
        </div>
      </div>

      {error && (
        <div className="card" style={{ color: "#dc2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {message && (
        <div className="card" style={{ color: "#15803d", marginBottom: 16 }}>
          {message}
        </div>
      )}

      {myTestimonial && !editing && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3>
            {myTestimonial.status === "pending"
              ? "Testimonial Pending"
              : myTestimonial.status === "approved"
                ? "Testimonial Approved"
                : "Testimonial Rejected"}
          </h3>

          <p>
            {myTestimonial.status === "pending"
              ? "Your testimonial is waiting for Super Admin approval."
              : myTestimonial.status === "approved"
                ? "Your testimonial has been approved for possible display on the website."
                : "You can revise your testimonial and submit it again."}
          </p>

          <blockquote>{myTestimonial.testimonial}</blockquote>

          {myTestimonial.admin_feedback && (
            <p>
              <strong>Admin feedback:</strong>{" "}
              {myTestimonial.admin_feedback}
            </p>
          )}

          {myTestimonial.status !== "pending" && (
            <button type="button" className="btn" onClick={handleEdit}>
              {myTestimonial.status === "approved"
                ? "Edit Testimonial"
                : "Revise Testimonial"}
            </button>
          )}
        </div>
      )}

      {(!myTestimonial ||
        myTestimonial.status === "rejected" ||
        editing) && (
        <form className="card" onSubmit={handleSubmit}>
          <h2>
            {editing ? "Edit Your Testimonial" : "Share Your Experience"}
          </h2>

          <label
            htmlFor="platform-testimonial"
            style={{ display: "block", margin: "16px 0 8px" }}
          >
            Your testimonial
          </label>

          <textarea
            id="platform-testimonial"
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            placeholder="Tell us how Swiss Barber helps your barbershop..."
            rows={6}
            maxLength={2000}
            required
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />

          <p className="muted">{testimonial.length}/2000 characters</p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="submit"
              className="btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : editing
                  ? "Update & Resubmit"
                  : "Submit for Approval"}
            </button>

            {editing && (
              <button
                type="button"
                className="btn"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
