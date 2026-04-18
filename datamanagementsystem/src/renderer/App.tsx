import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { StaffDashboardPage } from "./pages/StaffDashboard";
import { POSDashboardPage } from "./pages/POSDashboard";
import { ManagerDashboardPage } from "./pages/ManagerDashboard";

// Role-based guard component - redirects to login if not authorized
function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route is Login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Staff routes */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* POS routes */}
        <Route
          path="/pos/*"
          element={
            <ProtectedRoute allowedRoles={['pos']}>
              <POSDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Manager/Admin routes */}
        <Route
          path="/manager/*"
          element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <ManagerDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for unhandled routes redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
