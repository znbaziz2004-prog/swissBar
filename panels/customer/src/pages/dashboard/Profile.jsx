import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/customer-dashboard/profile"
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to load profile."
          );
        }

        const customer =
          response.data?.data?.customer ||
          response.data?.data?.profile ||
          null;

        setProfile(customer);

        if (customer) {
          localStorage.setItem(
            "swiss_barber_customer_user",
            JSON.stringify(customer)
          );

          sessionStorage.setItem(
            "swiss_barber_customer_user",
            JSON.stringify(customer)
          );
        }
      } catch (error) {
        console.error(
          "Customer profile error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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
    window.location.href = profile?.shopId
      ? `/shop/${profile.shopId}/book`
      : "/search";
  }}
>
  <span className="nav-icon">＋</span>
  <span>Book Appointment</span>
</button>

          <span className="nav-section-title">
            ACCOUNT
          </span>

          <button className="nav-item active">
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
              ACCOUNT
            </span>

            <h1>
              My <span>Profile</span>
            </h1>

            <p>
              View your customer account information.
            </p>
          </div>

          <div className="header-profile">

            <div className="notification-button">
              ♢
            </div>

            <div className="profile-avatar">
              {profile?.name
                ? profile.name.charAt(0).toUpperCase()
                : "A"}
            </div>

          </div>

        </header>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {loading ? (

          <section className="dashboard-panel profile-panel">

            <div className="appointments-loading">

              <div className="empty-icon">
                ♙
              </div>

              <h3>
                Loading profile...
              </h3>

              <p>
                Please wait while we load your
                account information.
              </p>

            </div>

          </section>

        ) : profile ? (

          <section className="profile-page-grid">

            {/* Profile Card */}
            <div className="dashboard-panel profile-main-panel">

              <div className="profile-cover">

                <div className="profile-large-avatar">
                  {profile.name
                    ? profile.name
                        .charAt(0)
                        .toUpperCase()
                    : "A"}
                </div>

              </div>

              <div className="profile-main-content">

                <div className="profile-name-block">

                  <span className="panel-label">
                    CUSTOMER
                  </span>

                  <h2>
                    {profile.name || "Customer"}
                  </h2>

                  <p>
                    Swiss Barber Customer
                  </p>

                </div>

                <div className="profile-details">

                  <div className="profile-detail-item">
                    <span>Full Name</span>
                    <strong>
                      {profile.name || "-"}
                    </strong>
                  </div>

                  <div className="profile-detail-item">
                    <span>Email Address</span>
                    <strong>
                      {profile.email || "-"}
                    </strong>
                  </div>

                  <div className="profile-detail-item">
                    <span>Phone Number</span>
                    <strong>
                      {profile.phone || "-"}
                    </strong>
                  </div>

                  <div className="profile-detail-item">
                    <span>Email Status</span>
                    <strong className="profile-verified">
                      {profile.emailVerifiedAt ||
                      profile.email_verified_at
                        ? "Verified"
                        : "Not verified"}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

            {/* Account Summary */}
            <div className="dashboard-panel profile-side-panel">

              <span className="panel-label">
                ACCOUNT
              </span>

              <h2>
                Account Status
              </h2>

              <div className="profile-status-box">

                <span className="profile-status-dot"></span>

                <div>
                  <strong>
                    Active
                  </strong>

                  <p>
                    Your customer dashboard
                    access is active.
                  </p>
                </div>

              </div>

              <div className="profile-info-row">

                <span>
                  Dashboard Access
                </span>

                <strong>
                  {profile.dashboardEnabled ||
                  profile.dashboard_enabled
                    ? "Enabled"
                    : "Disabled"}
                </strong>

              </div>

              <div className="profile-info-row">

                <span>
                  Customer ID
                </span>

                <strong>
                  #{profile.id || "-"}
                </strong>

              </div>

            </div>

          </section>

        ) : (

          <section className="dashboard-panel">

            <div className="empty-state">

              <div className="empty-icon">
                !
              </div>

              <h3>
                Profile not found
              </h3>

              <p>
                We could not load your customer
                profile.
              </p>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default Profile;