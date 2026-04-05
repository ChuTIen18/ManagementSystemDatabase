import { useState } from "react";
import { LoginRoleSelection } from "./components/LoginRoleSelection";
import { StaffDashboard } from "./components/StaffDashboard";
import { POSDashboard } from "./components/POSDashboard";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { InvoiceWithQR } from "./components/InvoiceWithQR";
import { CustomerFeedback } from "./components/CustomerFeedback";
import { Button } from "./components/ui/button";
import { LogOut, Receipt, Star } from "lucide-react";

type UserRole = "staff" | "pos" | "manager" | "invoice-demo" | "feedback-demo" | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [previousRole, setPreviousRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setPreviousRole(null);
  };

  const handleDemoMode = (demoRole: UserRole) => {
    setPreviousRole(userRole);
    setUserRole(demoRole);
  };

  const handleBackToPOS = () => {
    if (previousRole) {
      setUserRole(previousRole);
      setPreviousRole(null);
    } else {
      setUserRole("pos");
    }
  };

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case "staff":
        return "Nhân viên";
      case "pos":
        return "Máy POS";
      case "manager":
        return "Quản lý";
      default:
        return "";
    }
  };

  // Hiển thị màn hình đăng nhập nếu chưa chọn vai trò
  if (!userRole) {
    return (
      <LoginRoleSelection onRoleSelect={handleRoleSelect} />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-medium">Coffee House</h1>
          <p className="text-sm text-muted-foreground">
            {userRole === "invoice-demo" ? "Demo hóa đơn QR" : 
             userRole === "feedback-demo" ? "Demo đánh giá khách hàng" :
             `${getRoleTitle(userRole)} - Hệ thống quản lý`}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Demo buttons và Back button */}
          {(userRole === "staff" || userRole === "pos" || userRole === "manager") && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoMode("invoice-demo")}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Demo Hóa đơn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoMode("feedback-demo")}
              >
                <Star className="h-4 w-4 mr-2" />
                Demo Đánh giá
              </Button>
            </>
          )}
          {(userRole === "invoice-demo" || userRole === "feedback-demo") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToPOS}
            >
              ← Quay về
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Main Content - Hiển thị dashboard tương ứng với vai trò */}
      <div className="flex-1 overflow-y-auto">
        {userRole === "staff" && <StaffDashboard />}
        {userRole === "pos" && <POSDashboard />}
        {userRole === "manager" && <ManagerDashboard />}
        {userRole === "invoice-demo" && <InvoiceWithQR />}
        {userRole === "feedback-demo" && <CustomerFeedback mode="customer" invoiceId="INV001" />}
      </div>
    </div>
  );
}