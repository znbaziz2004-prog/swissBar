import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

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

          <button
            className="nav-item"
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
             window.location.href = "/search";
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
              ACCOUNT SETTINGS
            </span>

            <h1>
              Account <span>Settings</span>
            </h1>

            <p>
              Manage your customer account preferences.
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

        {/* Settings */}
        <section className="settings-page-grid">

          {/* Account */}
          <div className="dashboard-panel settings-panel">

            <div className="panel-header">
              <div>
                <span className="panel-label">
                  ACCOUNT
                </span>

                <h2>
                  Account Preferences
                </h2>
              </div>
            </div>

            <div className="settings-row">

              <div>
                <strong>
                  Profile Information
                </strong>

                <p>
                  View and manage your personal
                  customer information.
                </p>
              </div>

              <button
                type="button"
                className="settings-action-button"
                onClick={() =>
                  navigate("/customer/profile")
                }
              >
                View Profile
              </button>

            </div>

            <div className="settings-row">

              <div>
                <strong>
                  Password
                </strong>

                <p>
                  Keep your customer dashboard
                  password secure.
                </p>
              </div>

              <button
                type="button"
                className="settings-action-button"
              >
                Change Password
              </button>

            </div>

          </div>

          {/* Notifications */}
          <div className="dashboard-panel settings-panel">

            <div className="panel-header">
              <div>
                <span className="panel-label">
                  NOTIFICATIONS
                </span>

                <h2>
                  Email Notifications
                </h2>
              </div>
            </div>

            <div className="settings-row">

              <div>
                <strong>
                  Appointment Updates
                </strong>

                <p>
                  Receive booking confirmations,
                  cancellations and reschedule updates.
                </p>
              </div>

              <span className="settings-status enabled">
                Enabled
              </span>

            </div>

            <div className="settings-row">

              <div>
                <strong>
                  Booking Reminders
                </strong>

                <p>
                  Receive reminders before your
                  upcoming appointments.
                </p>
              </div>

              <span className="settings-status enabled">
                Enabled
              </span>

            </div>

          </div>

          {/* Security */}
          <div className="dashboard-panel settings-panel">

            <div className="panel-header">
              <div>
                <span className="panel-label">
                  SECURITY
                </span>

                <h2>
                  Account Security
                </h2>
              </div>
            </div>

            <div className="settings-security-box">

              <div className="security-icon">
                ✓
              </div>

              <div>
                <strong>
                  Your account is protected
                </strong>

                <p>
                  Your customer dashboard uses
                  authenticated access to protect
                  your appointment information.
                </p>
              </div>

            </div>

          </div>

          {/* Sign Out */}
          <div className="dashboard-panel settings-panel danger-panel">

            <div>
              <span className="panel-label">
                SESSION
              </span>

              <h2>
                Sign out
              </h2>

              <p>
                Sign out of your Swiss Barber
                customer dashboard on this device.
              </p>
            </div>

            <button
              type="button"
              className="settings-logout-button"
              onClick={handleLogout}
            >
              Sign out
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Settings;