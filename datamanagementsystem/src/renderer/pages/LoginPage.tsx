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
        case "staff":
          navigate("/staff/dashboard", { replace: true });
          break;
        case "pos":
          navigate("/pos/dashboard", { replace: true });
          break;
        case "manager":
          navigate("/manager/dashboard", { replace: true });
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

  const handleRoleSelect = (
    role: "staff" | "pos" | "manager",
    token: string,
    userData: any,
  ): void => {
    // Set user authentication with data from API
    setAuth({
      token: token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        fullName: userData.fullName,
        isActive: userData.isActive,
      },
    });
    // Navigation will happen via the useEffect above
  };

  return <LoginRoleSelection onRoleSelect={handleRoleSelect} />;
}
