import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import SetupPassword from "./pages/auth/SetupPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Appointments from "./pages/dashboard/Appointments";
import AppointmentDetails from "./pages/dashboard/AppointmentDetails";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/customer/login"
          element={<Login />}
        />

        <Route
          path="/customer/setup-password"
          element={<SetupPassword />}
        />

        <Route
          path="/customer/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/customer/appointments"
          element={<Appointments />}
        />

        <Route
  path="/customer/appointments/:id"
  element={<AppointmentDetails />}
/>
<Route
  path="/customer/profile"
  element={<Profile />}
/>

<Route
  path="/customer/settings"
  element={<Settings />}
/>

        <Route
          path="*"
          element={
            <Navigate
              to="/customer/login"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;