import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Appointments() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/customer-dashboard/bookings"
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to load appointments."
          );
        }

        setBookings(
          response.data?.data?.bookings || []
        );
      } catch (error) {
        console.error(
          "Customer appointments error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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

  const handleLogout = () => {
    localStorage.removeItem(
      "swiss_barber_customer_token"
    );

    localStorage.removeItem(
      "swiss_barber_customer_user"
    );

    sessionStorage.removeItem(
      "swiss_barber_customer_token"
    );

    sessionStorage.removeItem(
      "swiss_barber_customer_user"
    );

    navigate("/customer/login");
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

          <button className="nav-item active">
            <span className="nav-icon">◷</span>
            <span>My Appointments</span>
          </button>

          <button
  className="nav-item"
onClick={() => {
  window.location.href = `${import.meta.env.VITE_WEBSITE_URL}/search`;
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
              APPOINTMENTS
            </span>

            <h1>
              My <span>Appointments</span>
            </h1>

            <p>
              View and manage all your Swiss Barber
              appointments.
            </p>
          </div>

          <div className="header-profile">
            <div className="notification-button">
              ♢
            </div>

            <div className="profile-avatar">
              A
            </div>
          </div>
        </header>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <section className="dashboard-panel appointments-page-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                BOOKING HISTORY
              </span>

              <h2>All appointments</h2>
            </div>

            <span className="appointments-count">
              {loading
                ? "..."
                : `${bookings.length} bookings`}
            </span>
          </div>

          {loading ? (
            <div className="appointments-loading">
              <div className="empty-icon">
                ◷
              </div>

              <h3>
                Loading appointments...
              </h3>

              <p>
                Please wait while we load your bookings.
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                ◷
              </div>

              <h3>
                No appointments yet
              </h3>

              <p>
                You don't have any appointments.
                Book your first visit with Swiss Barber.
              </p>

            <button
  className="primary-small-button"
  onClick={() => {
    window.location.href = `${import.meta.env.VITE_WEBSITE_URL}/search`;
  }}
>
  Book an appointment →
</button>
            </div>
          ) : (
            <div className="appointments-table-wrapper">
              <div className="appointments-table">

                <div className="appointment-row appointment-row-header">
                  <span>Appointment</span>
                  <span>Barber</span>
                  <span>Date & Time</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span></span>
                </div>

                {bookings.map((booking) => (
                  <div
                    className="appointment-row"
                    key={booking.id}
                  >
                    <div className="appointment-service-cell">
                      <strong>
                        {booking.service?.name ||
                          "Appointment"}
                      </strong>

                      <span>
                        {booking.shop?.name ||
                          "Swiss Barber"}
                      </span>
                    </div>

                    <div>
                      <span>
                        {booking.staff?.name ||
                          "Not assigned"}
                      </span>
                    </div>

                    <div className="appointment-date-cell">
                      <strong>
                        {formatDate(
                          booking.date
                        )}
                      </strong>

                      <span>
                        {formatTime(
                          booking.startTime
                        )}
                        {" - "}
                        {formatTime(
                          booking.endTime
                        )}
                      </span>
                    </div>

                    <div className="appointment-amount">
                      {booking.currency ||
                        "CHF"}{" "}
                      {Number(
                        booking.totalAmount || 0
                      ).toFixed(2)}
                    </div>

                    <div>
                      <span
                        className={getStatusClass(
                          booking.status
                        )}
                      >
                        {booking.status ||
                          "unknown"}
                      </span>
                    </div>

                    <button
  className="appointment-view-button"
  type="button"
  onClick={() =>
    navigate(`/customer/appointments/${booking.id}`)
  }
>
  View
</button>
                  </div>
                ))}

              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Appointments;