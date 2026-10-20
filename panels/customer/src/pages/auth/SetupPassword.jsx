import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../services/api";

function SetupPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(!!tokenParam && !!emailParam);
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (tokenParam && emailParam) {
      const verifyToken = async () => {
        try {
          setVerifying(true);
          const res = await api.get("/customer-auth/verify-setup-token", {
            params: { token: tokenParam, email: emailParam },
          });
          if (res.data?.success) {
            setCustomerName(res.data?.data?.customerName || "");
          }
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "This setup link appears to be invalid or has expired."
          );
        } finally {
          setVerifying(false);
        }
      };
      verifyToken();
    }
  }, [tokenParam, emailParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !token.trim()) {
      setError("Please provide both your email address and setup token.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/customer-auth/setup-password", {
        token: token.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data?.success) {
        setSuccess(
          res.data.message ||
            "Password created successfully! Redirecting to login..."
        );
        setTimeout(() => {
          navigate("/customer/login");
        }, 2000);
      } else {
        throw new Error(res.data?.message || "Failed to set up password.");
      }
    } catch (err) {
      console.error("Setup password error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to set password. Please try again or request a new link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-auth-page">
      <div className="auth-background-glow glow-one"></div>
      <div className="auth-background-glow glow-two"></div>

      <div className="auth-container">
        {/* Left Side */}
        <div className="auth-brand-section">
          <div className="brand-logo">
            <span className="logo-mark">S</span>
            <span>Swiss Barber</span>
          </div>

          <div className="brand-content">
            <span className="brand-badge">PORTAL ACTIVATION</span>

            <h1>
              Set up your
              <br />
              <span>Customer Account</span>
            </h1>

            <p>
              Choose a secure password to activate your personal customer
              dashboard and manage your Swiss Barber appointments effortlessly.
            </p>

            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div>
                  <strong>Direct Access</strong>
                  <span>Manage and reschedule your bookings 24/7.</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">◷</div>
                <div>
                  <strong>Booking History</strong>
                  <span>Keep track of all your past appointments & services.</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">◆</div>
                <div>
                  <strong>Secure & Private</strong>
                  <span>Your profile and preferences are encrypted and protected.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="brand-footer">
            <span>© 2026 Swiss Barber</span>
            <span>Premium Barber Experience</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="auth-form-section">
          <div className="login-card">
            <div className="mobile-logo">
              <span className="logo-mark">S</span>
              <span>Swiss Barber</span>
            </div>

            <div className="form-header">
              <span className="welcome-label">SECURITY SETUP</span>
              <h2>Create your password</h2>
              <p>
                {customerName
                  ? `Welcome, ${customerName}! Enter your new password below.`
                  : "Enter your registered email and choose a strong password."}
              </p>
            </div>

            {error && <div className="login-error">{error}</div>}

            {success && (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(34, 197, 94, 0.15)",
                  color: "#4ade80",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  marginBottom: "20px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {success}
              </div>
            )}

            {verifying ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#a1a1aa" }}>
                Verifying setup link...
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">@</span>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={loading || !!emailParam}
                      required
                    />
                  </div>
                </div>

                {!tokenParam && (
                  <div className="form-group">
                    <label htmlFor="token">Setup Token</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔑</span>
                      <input
                        id="token"
                        type="text"
                        placeholder="Paste verification token from email"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">●</span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">●</span>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                  style={{ marginTop: "10px" }}
                >
                  <span>{loading ? "Activating account..." : "Set Password & Continue"}</span>
                  <span className="button-arrow">{loading ? "..." : "→"}</span>
                </button>
              </form>
            )}

            <div className="divider">
              <span>or</span>
            </div>

            <div className="register-text">
              Already have your password set?
              <Link
                to="/customer/login"
                style={{
                  color: "#d4af37",
                  marginLeft: "8px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign in to Dashboard
              </Link>
            </div>

            <div className="security-note">
              <span className="security-icon">✓</span>
              <span>Your security is protected with industry-standard encryption.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupPassword;
