import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Clock,
  Calendar,
  FileText,
  BarChart3,
  Timer,
  DollarSign,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

interface AttendanceRecord {
  date: number;
  dayOfWeek: string;
  shift: string;
  timeRange: string;
  duration: string;
  status: "on-time" | "late";
}

interface SalaryBreakdown {
  workingHours: string;
  bonus: string;
  fine: string;
  total: string;
  baseSalary: string;
}

/**
 * FigmaStaffDashboard - Staff Dashboard component matching Figma design
 * Displays employee dashboard with attendance tracking, salary info, and shift details
 */
export function FigmaStaffDashboard() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [currentTime, setCurrentTime] = useState<string>("");
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const attendanceRecords: AttendanceRecord[] = [
    {
      date: 9,
      dayOfWeek: "Th 12",
      shift: "Ca sáng",
      timeRange: "06:00 - 12:00 (6h)",
      duration: "6h",
      status: "on-time",
    },
    {
      date: 8,
      dayOfWeek: "Th 12",
      shift: "Ca sáng",
      timeRange: "06:15 - 12:00 (5.75h)",
      duration: "5.75h",
      status: "late",
    },
    {
      date: 7,
      dayOfWeek: "Th 12",
      shift: "Ca chiều",
      timeRange: "16:00 - 20:00 (4h)",
      duration: "4h",
      status: "on-time",
    },
    {
      date: 6,
      dayOfWeek: "Th 12",
      shift: "Ca tối",
      timeRange: "20:10 - 23:00 (2.83h)",
      duration: "2.83h",
      status: "late",
    },
    {
      date: 5,
      dayOfWeek: "Th 12",
      shift: "Ca trưa",
      timeRange: "12:00 - 16:00 (4h)",
      duration: "4h",
      status: "on-time",
    },
  ];

  const salaryBreakdown: SalaryBreakdown = {
    workingHours: "168h",
    bonus: "500,000đ",
    fine: "0đ",
    total: "4,700,000đ",
    baseSalary: "25,000đ/giờ",
  };

  const weeklySummary = {
    workingHours: "32h",
    workDays: "5",
    lateDays: "2",
  };

  const currentShift = {
    name: "Ca sáng",
    time: "06:00 - 12:00",
    currentTime: "22:04",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-medium text-gray-900">Coffee House</h1>
            <p className="text-xs text-gray-500">
              Nhân viên - Hệ thống quản lý
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              Demo Hóa đơn
            </button>
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              Demo Đánh giá
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 rounded hover:bg-gray-50 flex items-center gap-1" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">
              Bảng điều khiển nhân viên
            </h2>
            <p className="text-sm text-gray-500">Chào mừng trở lại!</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Thời gian hiện tại</p>
            <p className="text-sm font-medium text-gray-900">{currentTime}</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Giờ làm hôm nay</p>
                <p className="text-2xl font-medium text-gray-900">7.5h</p>
              </div>
              <Timer className="h-7 w-7 text-green-600" />
            </div>
          </Card>

          <Card className="p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Lương tháng</p>
                <p className="text-2xl font-medium text-gray-900">8.2M</p>
              </div>
              <DollarSign className="h-7 w-7 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="attendance"
              className="flex items-center gap-1 text-xs py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Chấm công</span>
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="flex items-center gap-1 text-xs py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Lịch LV</span>
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="flex items-center gap-1 text-xs py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>HĐ</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center gap-1 text-xs py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Báo cáo</span>
            </TabsTrigger>
          </TabsList>

          {/* Attendance Tab Content */}
          <TabsContent value="attendance" className="space-y-4 mt-6">
            {/* Quick Stats for Attendance */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Giờ làm hôm nay</p>
                    <p className="text-2xl font-medium text-gray-900">0h</p>
                  </div>
                  <Timer className="h-7 w-7 text-green-600" />
                </div>
              </Card>

              <Card className="p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Trạng thái</p>
                    <p className="text-lg font-medium text-gray-900">Nghỉ</p>
                  </div>
                  <AlertCircle className="h-7 w-7 text-yellow-600" />
                </div>
              </Card>
            </div>

            {/* Salary Breakdown */}
            <Card className="p-4 border border-gray-200 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">
                  Trạng thái lương tháng này
                </h3>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">168h</p>
                  <p className="text-xs text-blue-600 mt-1">Giờ làm việc</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">500,000đ</p>
                  <p className="text-xs text-green-600 mt-1">Tiền thưởng</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xl font-bold text-red-600">0đ</p>
                  <p className="text-xs text-red-600 mt-1">Tiền phạt</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xl font-bold text-purple-600">4,700,000đ</p>
                  <p className="text-xs text-purple-600 mt-1">Tổng lương</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Lương cơ bản: {salaryBreakdown.baseSalary}
              </p>
            </Card>

            {/* Fingerprint Scanner */}
            <Card className="p-4 border border-gray-200 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">
                  Chấm công vân tay
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                Sử dụng máy quét vân tay để chấm công vào/ra ca
              </p>

              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center">
                  <Zap className="h-14 w-14 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 text-center">
                  Đặt ngón tay lên máy quét để chấm công vào ca
                </p>
                <Badge variant="secondary" className="text-xs">
                  Sẵn sàng quét
                </Badge>
              </div>
            </Card>

            {/* Current Shift Info */}
            <Card className="p-4 border border-gray-200 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">
                  Thông tin ca làm việc hiện tại
                </h3>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {currentShift.name}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {currentShift.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Thời gian hiện tại</p>
                    <p className="text-sm font-medium text-blue-900">
                      {currentTime}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Attendance History */}
            <Card className="p-4 border border-gray-200 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Lịch sử chấm công gần đây
              </h3>

              <div className="space-y-2">
                {attendanceRecords.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {record.date}
                        </p>
                        <p className="text-xs text-gray-500">{record.dayOfWeek}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {record.shift}
                        </p>
                        <p className="text-xs text-gray-500">
                          {record.timeRange}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        record.status === "on-time" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {record.status === "on-time" ? "Đúng giờ" : "Trễ"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Summary */}
            <Card className="p-4 border border-gray-200 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Tóm tắt tuần này
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">
                    {weeklySummary.workingHours}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Giờ làm việc</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">
                    {weeklySummary.workDays}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Ngày đi làm</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xl font-bold text-yellow-600">
                    {weeklySummary.lateDays}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Lần đi trễ</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Placeholder for other tabs */}
          <TabsContent value="schedule" className="mt-6">
            <Card className="p-8 border border-gray-200 text-center">
              <p className="text-gray-500">Nội dung lịch làm việc</p>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <Card className="p-8 border border-gray-200 text-center">
              <p className="text-gray-500">Nội dung hóa đơn</p>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card className="p-8 border border-gray-200 text-center">
              <p className="text-gray-500">Nội dung báo cáo</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Icon components placeholder - using lucide-react icons
function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
