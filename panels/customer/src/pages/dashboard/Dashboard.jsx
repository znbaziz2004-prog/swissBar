import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, bookingsResponse] = await Promise.all([
          api.get("/customer-dashboard/profile"),
          api.get("/customer-dashboard/bookings"),
        ]);

        const profileCustomer =
          profileResponse.data?.data?.customer;

        const customerBookings =
          bookingsResponse.data?.data?.bookings || [];

        setCustomer(profileCustomer || null);
        setBookings(customerBookings);

        // Updated customer data local storage/session storage mein bhi save
        if (profileCustomer) {
          const storage = localStorage.getItem(
            "swiss_barber_customer_token"
          )
            ? localStorage
            : sessionStorage;

          storage.setItem(
            "swiss_barber_customer_user",
            JSON.stringify(profileCustomer)
          );
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);

        const message =
          error.response?.data?.message ||
          "Unable to load dashboard data.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const customerName =
    customer?.name ||
    customer?.full_name ||
    customer?.customer_name ||
    "Customer";

  /*
   * Calculate dashboard stats
   */
  const totalAppointments = bookings.length;

  const upcomingAppointments = bookings.filter((booking) => {
    const bookingDate = new Date(
      `${booking.date}T${booking.startTime}`
    );

    return (
      bookingDate >= new Date() &&
      ["pending", "confirmed"].includes(
        String(booking.status).toLowerCase()
      )
    );
  });

  const completedAppointments = bookings.filter(
    (booking) =>
      String(booking.status).toLowerCase() === "completed"
  );

  /*
   * Show only upcoming appointments in schedule section
   */
  const displayedUpcomingAppointments =
    upcomingAppointments.slice(0, 3);

  /*
   * Format appointment date
   */
  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  /*
   * Format time
   */
  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = String(time)
      .split(":")
      .map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return time;
    }

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("swiss_barber_customer_token");
    localStorage.removeItem("swiss_barber_customer_user");

    sessionStorage.removeItem("swiss_barber_customer_token");
    sessionStorage.removeItem("swiss_barber_customer_user");

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
          <span className="nav-section-title">MAIN MENU</span>

          <button className="nav-item active">
            <span className="nav-icon">⌂</span>
            <span>Overview</span>
          </button>

          <button
  className="nav-item"
  onClick={() => navigate("/customer/appointments")}
>
  <span className="nav-icon">◷</span>
  <span>My Appointments</span>
</button>

          <button
  className="nav-item"
onClick={() => {
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL;

  window.location.href = customer?.shopId
    ? `${websiteUrl}/shop/${customer.shopId}/book`
    : `${websiteUrl}/search`;
}}
>
  <span className="nav-icon">＋</span>
  <span>Book Appointment</span>
</button>

          <span className="nav-section-title">ACCOUNT</span>

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
              CUSTOMER DASHBOARD
            </span>

            <h1>
              Welcome back, <span>{customerName}</span>
            </h1>

            <p>
              Manage your appointments and profile from one place.
            </p>
          </div>

          <div className="header-profile">
            <div className="notification-button">♢</div>

            <div className="profile-avatar">
              {customerName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total appointments</span>
              <div className="stat-icon">◷</div>
            </div>

            <strong>
              {loading ? "..." : totalAppointments}
            </strong>

            <span className="stat-footer">
              All your bookings
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Upcoming</span>
              <div className="stat-icon">→</div>
            </div>

            <strong>
              {loading ? "..." : upcomingAppointments.length}
            </strong>

            <span className="stat-footer">
              Scheduled appointments
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Completed</span>
              <div className="stat-icon">✓</div>
            </div>

            <strong>
              {loading ? "..." : completedAppointments.length}
            </strong>

            <span className="stat-footer">
              Finished appointments
            </span>
          </div>

          <div className="stat-card highlight-card">
            <div className="stat-top">
              <span>Quick booking</span>
              <div className="stat-icon">＋</div>
            </div>

            <strong>Book now</strong>

            <span className="stat-footer">
              Find a barber near you
            </span>
          </div>
        </section>

        {/* Content */}
        <section className="dashboard-content-grid">
          <div className="dashboard-panel appointments-panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">
                  YOUR SCHEDULE
                </span>

                <h2>Upcoming appointments</h2>
              </div>

              <button
  className="view-all-button"
  onClick={() => navigate("/customer/appointments")}
>
  View all →
</button>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">◷</div>

                <h3>Loading appointments...</h3>

                <p>
                  We're loading your latest appointments.
                </p>
              </div>
            ) : displayedUpcomingAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◷</div>

                <h3>No upcoming appointments</h3>

                <p>
                  You don't have any upcoming appointments.
                  Book your next visit whenever you're ready.
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
              <div className="upcoming-list">
                {displayedUpcomingAppointments.map(
                  (booking) => (
                    <div
                      className="upcoming-appointment"
                      key={booking.id}
                    >
                      <div className="appointment-date-box">
                        <strong>
                          {new Date(
                            booking.date
                          ).getDate()}
                        </strong>

                        <span>
                          {new Date(
                            booking.date
                          ).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                            }
                          )}
                        </span>
                      </div>

                      <div className="appointment-info">
                        <strong>
                          {booking.service?.name ||
                            "Appointment"}
                        </strong>

                        <span>
                          {booking.shop?.name ||
                            "Swiss Barber"}
                        </span>

                        <span>
                          {booking.staff?.name
                            ? `Barber: ${booking.staff.name}`
                            : ""}
                        </span>
                      </div>

                      <div className="appointment-time">
                        <strong>
                          {formatTime(
                            booking.startTime
                          )}
                        </strong>

                        <span>
                          {formatDate(
                            booking.date
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="dashboard-panel quick-panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">
                  QUICK ACTIONS
                </span>

                <h2>What would you like to do?</h2>
              </div>
            </div>

            <div className="quick-actions">
             <button
  className="quick-action"
 onClick={() => {
  window.location.href = `${import.meta.env.VITE_WEBSITE_URL}/search`;
}}
>
                <div className="quick-action-icon">
                  ＋
                </div>

                <div>
                  <strong>Book appointment</strong>
                  <span>
                    Find a barber and choose a time
                  </span>
                </div>

                <b>→</b>
              </button>

              <button className="quick-action">
                <div className="quick-action-icon">
                  ◷
                </div>

                <div>
                  <strong>Appointment history</strong>
                  <span>
                    View your previous visits
                  </span>
                </div>

                <b>→</b>
              </button>

              <button className="quick-action">
                <div className="quick-action-icon">
                  ♙
                </div>

                <div>
                  <strong>Update profile</strong>
                  <span>
                    Manage your personal information
                  </span>
                </div>

                <b>→</b>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;