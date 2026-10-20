import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function AppointmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const [rescheduling, setRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // Review states
  const [review, setReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        setError("");
        setReview(null);

        const response = await api.get(
          `/customer-dashboard/bookings/${id}`
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to load appointment."
          );
        }

        const loadedBooking =
          response.data?.data?.booking || null;

        setBooking(loadedBooking);

        // Load review only for a completed appointment
        if (
          loadedBooking &&
          String(loadedBooking.status || "").toLowerCase() ===
            "completed"
        ) {
          setReviewLoading(true);

          try {
            const reviewResponse = await api.get(
              `/customer-dashboard/bookings/${id}/review`
            );

            if (reviewResponse.data?.success) {
              const existingReview =
                reviewResponse.data?.data?.review || null;

              setReview(existingReview);

              if (existingReview) {
                setRating(Number(existingReview.rating) || 0);
                setComment(existingReview.comment || "");
              }
            }
          } catch (reviewError) {
            console.error(
              "Load appointment review error:",
              reviewError
            );

            // Keep appointment details available even if
            // the review endpoint fails.
          } finally {
            setReviewLoading(false);
          }
        }
      } catch (error) {
        console.error("Appointment details error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load appointment details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = String(time)
      .split(":")
      .map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return time;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    return `appointment-status ${String(
      status || ""
    ).toLowerCase()}`;
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");
      setSuccessMessage("");

      const response = await api.patch(
        `/customer-dashboard/bookings/${id}/cancel`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to cancel appointment."
        );
      }

      setBooking((previousBooking) => ({
        ...previousBooking,
        status: "cancelled",
      }));

      setSuccessMessage(
        "Appointment cancelled successfully."
      );
    } catch (error) {
      console.error("Cancel appointment error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to cancel appointment."
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      setError("Please select a new date and time.");
      return;
    }

    try {
      setRescheduling(true);
      setError("");
      setSuccessMessage("");

      const availabilityResponse = await api.get(
        `/customer-dashboard/bookings/${id}/reschedule-availability`,
        {
          params: {
            date: newDate,
            startTime: newTime,
          },
        }
      );

      if (!availabilityResponse.data?.success) {
        throw new Error(
          availabilityResponse.data?.message ||
            "Unable to check availability."
        );
      }

      if (!availabilityResponse.data?.data?.available) {
        setError(
          availabilityResponse.data?.data?.message ||
            "This time slot is not available."
        );
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to reschedule this appointment?"
      );

      if (!confirmed) return;

      const updateResponse = await api.patch(
        `/customer-dashboard/bookings/${id}/reschedule`,
        {
          date: newDate,
          startTime: newTime,
        }
      );

      if (!updateResponse.data?.success) {
        throw new Error(
          updateResponse.data?.message ||
            "Unable to reschedule appointment."
        );
      }

      setBooking((previousBooking) => ({
        ...previousBooking,
        date: newDate,
        startTime: newTime,
        endTime:
          updateResponse.data?.data?.endTime ||
          previousBooking.endTime,
        status:
          updateResponse.data?.data?.status ||
          "rescheduled",
      }));

      setNewDate("");
      setNewTime("");

      setSuccessMessage(
        "Appointment rescheduled successfully."
      );
    } catch (error) {
      console.error(
        "Reschedule appointment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to reschedule appointment."
      );
    } finally {
      setRescheduling(false);
    }
  };

  // Submit a review for the completed appointment
  const handleSubmitReview = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating from 1 to 5 stars.");
      return;
    }

    if (
      !booking ||
      String(booking.status || "").toLowerCase() !==
        "completed"
    ) {
      setError(
        "You can only review a completed appointment."
      );
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await api.post("/reviews", {
        appointmentId: booking.id,
        rating,
        comment: comment.trim(),
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to submit your review."
        );
      }

      const savedReview =
        response.data?.data?.review || {
          appointment_id: booking.id,
          rating,
          comment: comment.trim(),
          status: "pending",
        };

      setReview(savedReview);
      setRating(Number(savedReview.rating) || rating);
      setComment(savedReview.comment || comment.trim());

      setSuccessMessage(
        "Your review has been submitted and is awaiting approval."
      );
    } catch (error) {
      console.error("Submit review error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to submit your review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("swiss_barber_customer_token");
    localStorage.removeItem("swiss_barber_customer_user");
    sessionStorage.removeItem("swiss_barber_customer_token");
    sessionStorage.removeItem("swiss_barber_customer_user");

    navigate("/customer/login");
  };

  const isCompleted =
    String(booking?.status || "").toLowerCase() ===
    "completed";

  const reviewStatus = String(
    review?.status || ""
  ).toLowerCase();

  const getReviewStatusText = () => {
    switch (reviewStatus) {
      case "approved":
        return "Your review has been approved.";
      case "rejected":
        return "Your review was rejected.";
      case "pending":
        return "Your review is awaiting approval.";
      default:
        return "Your review has been recorded.";
    }
  };

  return (
    <div className="customer-dashboard">
      {/* Sidebar */}
      <aside className="customer-sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">S</span>

          <div>
            <strong>Swiss Barber</strong>
            <span>Customer Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">
            MAIN MENU
          </span>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/customer/dashboard")
            }
          >
            <span className="nav-icon">⌂</span>
            <span>Overview</span>
          </button>

          <button
            className="nav-item active"
            onClick={() =>
              navigate("/customer/appointments")
            }
          >
            <span className="nav-icon">◷</span>
            <span>My Appointments</span>
          </button>

          <button
            className="nav-item"
            onClick={() => {
              window.location.href = booking?.shop?.id
                ? `/shop/${booking.shop.id}/book`
                : "/search";
            }}
          >
            <span className="nav-icon">＋</span>
            <span>Book Appointment</span>
          </button>

          <span className="nav-section-title">
            ACCOUNT
          </span>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/customer/profile")
            }
          >
            <span className="nav-icon">♙</span>
            <span>My Profile</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/customer/settings")
            }
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon">?</div>

            <div>
              <strong>Need help?</strong>
              <span>Contact Swiss Barber</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="customer-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-label">
              APPOINTMENT DETAILS
            </span>

            <h1>
              Appointment <span>Details</span>
            </h1>

            <p>
              View the complete information for your
              appointment.
            </p>
          </div>

          <div className="header-profile">
            <div className="notification-button">
              ♢
            </div>

            <div className="profile-avatar">A</div>
          </div>
        </header>

        <button
          className="view-all-button"
          onClick={() =>
            navigate("/customer/appointments")
          }
        >
          ← Back to appointments
        </button>

        {/* Error */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="appointment-success-message">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <section className="dashboard-panel appointment-details-panel">
            <div className="appointments-loading">
              <div className="empty-icon">◷</div>

              <h3>Loading appointment...</h3>

              <p>
                Please wait while we load the appointment
                details.
              </p>
            </div>
          </section>
        ) : booking ? (
          <section className="appointment-details-grid">
            {/* Main Details */}
            <div className="dashboard-panel appointment-details-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-label">
                    BOOKING INFORMATION
                  </span>

                  <h2>
                    {booking.service?.name ||
                      "Appointment"}
                  </h2>
                </div>

                <span
                  className={getStatusClass(
                    booking.status
                  )}
                >
                  {booking.status}
                </span>
              </div>

              <div className="details-section">
                <div className="detail-item">
                  <span>Date</span>
                  <strong>
                    {formatDate(booking.date)}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Time</span>
                  <strong>
                    {formatTime(booking.startTime)}
                    {" - "}
                    {formatTime(booking.endTime)}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Service</span>
                  <strong>
                    {booking.service?.name || "-"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Duration</span>
                  <strong>
                    {booking.service?.durationMinutes
                      ? `${booking.service.durationMinutes} minutes`
                      : "-"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Barber</span>
                  <strong>
                    {booking.staff?.name ||
                      "Not assigned"}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Branch</span>
                  <strong>
                    {booking.branch?.name || "-"}
                  </strong>
                </div>
              </div>

              {booking.customerNote && (
                <div className="customer-note-box">
                  <span>YOUR NOTE</span>
                  <p>{booking.customerNote}</p>
                </div>
              )}

              {/* Existing appointment actions */}
              {["pending", "confirmed"].includes(
                String(booking.status || "").toLowerCase()
              ) && (
                <div className="appointment-actions">
                  <div className="reschedule-fields">
                    <div className="reschedule-field">
                      <label htmlFor="newDate">
                        New Date
                      </label>

                      <input
                        id="newDate"
                        type="date"
                        value={newDate}
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(event) =>
                          setNewDate(event.target.value)
                        }
                      />
                    </div>

                    <div className="reschedule-field">
                      <label htmlFor="newTime">
                        New Time
                      </label>

                      <input
                        id="newTime"
                        type="time"
                        value={newTime}
                        onChange={(event) =>
                          setNewTime(event.target.value)
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="reschedule-button"
                      onClick={handleReschedule}
                      disabled={rescheduling}
                    >
                      {rescheduling
                        ? "Checking..."
                        : "Reschedule"}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="cancel-appointment-button"
                    onClick={handleCancel}
                    disabled={cancelling}
                  >
                    {cancelling
                      ? "Cancelling..."
                      : "Cancel Appointment"}
                  </button>
                </div>
              )}

              {/* Customer Review */}
              {isCompleted && (
                <div className="customer-review-section">
                  <div className="review-heading">
                    <span className="panel-label">
                      YOUR FEEDBACK
                    </span>

                    <h2>Rate Your Experience</h2>

                    <p>
                      Tell us how your appointment went.
                    </p>
                  </div>

                  {reviewLoading ? (
                    <p>Loading your review...</p>
                  ) : review ? (
                    <div className="existing-review">
                      <div
                        className="review-stars"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from(
                          { length: 5 },
                          (_, index) => (
                            <span
                              key={index}
                              className={
                                index < Number(review.rating)
                                  ? "review-star selected"
                                  : "review-star"
                              }
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>

                      {review.comment && (
                        <p className="review-comment">
                          {review.comment}
                        </p>
                      )}

                      <div className="review-status-message">
                        <strong>Review status:</strong>{" "}
                        {getReviewStatusText()}
                      </div>
                    </div>
                  ) : (
                    <form
                      className="customer-review-form"
                      onSubmit={handleSubmitReview}
                    >
                      <label className="review-field-label">
                        Your Rating
                      </label>

                      <div
                        className="review-rating-input"
                        role="group"
                        aria-label="Select a rating from one to five stars"
                      >
                        {Array.from(
                          { length: 5 },
                          (_, index) => {
                            const star = index + 1;

                            return (
                              <button
                                key={star}
                                type="button"
                                className={
                                  star <=
                                  (hoverRating || rating)
                                    ? "review-star-button selected"
                                    : "review-star-button"
                                }
                                onClick={() =>
                                  setRating(star)
                                }
                                onMouseEnter={() =>
                                  setHoverRating(star)
                                }
                                onMouseLeave={() =>
                                  setHoverRating(0)
                                }
                                onFocus={() =>
                                  setHoverRating(star)
                                }
                                onBlur={() =>
                                  setHoverRating(0)
                                }
                                aria-label={`${star} ${
                                  star === 1
                                    ? "star"
                                    : "stars"
                                }`}
                                aria-pressed={rating === star}
                              >
                                ★
                              </button>
                            );
                          }
                        )}
                      </div>

                      <p className="review-rating-hint">
                        {rating === 0
                          ? "Select your rating"
                          : `${rating} out of 5 stars`}
                      </p>

                      <label
                        htmlFor="reviewComment"
                        className="review-field-label"
                      >
                        Your Comment (Optional)
                      </label>

                      <textarea
                        id="reviewComment"
                        className="review-comment-input"
                        rows="4"
                        maxLength="2000"
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(event) =>
                          setComment(event.target.value)
                        }
                      />

                      <button
                        type="submit"
                        className="reschedule-button submit-review-button"
                        disabled={
                          submittingReview || rating === 0
                        }
                      >
                        {submittingReview
                          ? "Submitting..."
                          : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Shop / Payment */}
            <div className="dashboard-panel appointment-side-panel">
              <span className="panel-label">
                BARBER SHOP
              </span>

              <h2>
                {booking.shop?.name || "Swiss Barber"}
              </h2>

              <div className="shop-detail">
                <span>Branch</span>
                <strong>
                  {booking.branch?.name || "-"}
                </strong>
              </div>

              <div className="shop-detail">
                <span>Barber</span>
                <strong>
                  {booking.staff?.name || "-"}
                </strong>
              </div>

              <div className="shop-detail">
                <span>Service</span>
                <strong>
                  {booking.service?.name || "-"}
                </strong>
              </div>

              <div className="appointment-price-box">
                <span>Total amount</span>

                <strong>
                  {booking.currency || "CHF"}{" "}
                  {Number(
                    booking.totalAmount || 0
                  ).toFixed(2)}
                </strong>
              </div>
            </div>
          </section>
        ) : (
          <section className="dashboard-panel">
            <div className="empty-state">
              <div className="empty-icon">!</div>

              <h3>Appointment not found</h3>

              <p>
                This appointment could not be found
                or is no longer available.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AppointmentDetails;