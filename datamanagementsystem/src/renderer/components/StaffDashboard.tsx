import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AttendanceOnly } from "./AttendanceOnly";
import { PersonalSchedule } from "./PersonalSchedule";
import { StaffInvoiceProcessing } from "./StaffInvoiceProcessing";
import { StaffReports } from "./StaffReports";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Clock,
  Calendar,
  FileText,
  BarChart3,
  Timer,
  DollarSign,
  LogOut
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

export function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("attendance");
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bảng điều khiển nhân viên</h1>
          <p className="text-muted-foreground">Chào mừng trở lại!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Thời gian hiện tại</p>
            <p className="font-medium">{getCurrentTime()}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Giờ làm hôm nay</p>
              <p className="text-2xl font-medium">7.5h</p>
            </div>
            <Timer className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lương tháng</p>
              <p className="text-2xl font-medium">8.2M</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 text-xs">
          <TabsTrigger value="attendance" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Chấm công</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Lịch LV</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">HĐ</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Báo cáo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <AttendanceOnly />
        </TabsContent>

        <TabsContent value="schedule">
          <PersonalSchedule />
        </TabsContent>

        <TabsContent value="invoices">
          <StaffInvoiceProcessing />
        </TabsContent>

        <TabsContent value="reports">
          <StaffReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}