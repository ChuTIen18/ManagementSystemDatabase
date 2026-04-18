import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoginRoleSelection } from "../components/LoginRoleSelection";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();

  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'staff':
          navigate("/staff/dashboard", { replace: true });
          break;
        case 'pos':
          navigate("/pos/dashboard", { replace: true });
          break;
        case 'manager':
          navigate("/manager/dashboard", { replace: true });
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

  const handleRoleSelect = (role: "staff" | "pos" | "manager"): void => {
    // Set user authentication with mock data
    // In a real application, this would come from an actual login API call
    setAuth({
      token: 'mock-token',
      user: {
        id: 1,
        username: role,
        email: `${role}@coffeehouse.com`,
        role: role,
        fullName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        isActive: true
      }
    });
    // Navigation will happen via the useEffect above
  };

  return (
    <LoginRoleSelection
      onRoleSelect={handleRoleSelect}
    />
  );
}