import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserPlus,
  UserMinus,
  Eye,
  Calendar as CalendarIcon,
  Settings,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Key,
  Shield,
  UserX,
  RefreshCw,
} from "lucide-react";
import { Input } from "./ui/input";

const localizer = momentLocalizer(moment);

type ShiftType = "morning" | "noon" | "afternoon" | "night";
type ScheduleStatus = "pending" | "approved" | "rejected";

interface ShiftSlot {
  id: string;
  date: Date;
  shift: ShiftType;
  status: ScheduleStatus;
  hours: number;
  employeeName: string;
  employeeId: string;
}

interface StaffMember {
  id: string;
  name: string;
  position: string;
  shift: string;
  performance: string;
  salary: number;
  phone: string;
  email: string;
  avatar?: string;
  // Thông tin tài khoản
  username: string;
  password: string;
  role: "staff" | "pos";
  accountStatus: "active" | "inactive" | "locked";
  lastLogin?: Date;
  createdAt: Date;
}

interface StaffingRequirement {
  shift: ShiftType;
  requiredStaff: number;
  minStaff: number;
}

const SHIFTS = [
  { id: "morning", name: "Ca sáng", time: "06:00 - 12:00", color: "#3b82f6" },
  { id: "noon", name: "Ca trưa", time: "12:00 - 16:00", color: "#10b981" },
  { id: "afternoon", name: "Ca chiều", time: "16:00 - 20:00", color: "#f59e0b" },
  { id: "night", name: "Ca tối", time: "20:00 - 23:00", color: "#8b5cf6" },
];

const STAFFING_REQUIREMENTS: StaffingRequirement[] = [
  { shift: "morning", requiredStaff: 4, minStaff: 3 },
  { shift: "noon", requiredStaff: 3, minStaff: 2 },
  { shift: "afternoon", requiredStaff: 4, minStaff: 3 },
  { shift: "night", requiredStaff: 2, minStaff: 1 },
];

export function ScheduleOverview() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftType | "all">("all");
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({});
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);
  const [staffFilter, setStaffFilter] = useState<"all" | "staff" | "pos">("all");
  const [newStaffData, setNewStaffData] = useState<Partial<StaffMember>>({
    role: "staff",
    accountStatus: "active",
    performance: "average"
  });

  // Mock data cho lịch làm việc đã duyệt
  const [approvedSchedules] = useState<ShiftSlot[]>([
    // Ngày 15/9/2025
    { id: "1", date: new Date("2025-09-15"), shift: "morning", status: "approved", hours: 6, employeeName: "Nguyễn Văn A", employeeId: "NV001" },
    { id: "2", date: new Date("2025-09-15"), shift: "morning", status: "approved", hours: 6, employeeName: "Trần Thị B", employeeId: "NV002" },
    { id: "3", date: new Date("2025-09-15"), shift: "afternoon", status: "approved", hours: 4, employeeName: "Lê Văn C", employeeId: "NV003" },
    { id: "4", date: new Date("2025-09-15"), shift: "afternoon", status: "approved", hours: 4, employeeName: "Phạm Thị D", employeeId: "NV004" },
    { id: "5", date: new Date("2025-09-15"), shift: "night", status: "approved", hours: 3, employeeName: "Hoàng Văn E", employeeId: "NV005" },
    
    // Ngày 16/9/2025
    { id: "6", date: new Date("2025-09-16"), shift: "morning", status: "approved", hours: 6, employeeName: "Nguyễn Văn A", employeeId: "NV001" },
    { id: "7", date: new Date("2025-09-16"), shift: "morning", status: "approved", hours: 6, employeeName: "Lê Văn C", employeeId: "NV003" },
    { id: "8", date: new Date("2025-09-16"), shift: "afternoon", status: "approved", hours: 4, employeeName: "Trần Thị B", employeeId: "NV002" },
    { id: "9", date: new Date("2025-09-16"), shift: "afternoon", status: "approved", hours: 4, employeeName: "Phạm Thị D", employeeId: "NV004" },
    { id: "10", date: new Date("2025-09-16"), shift: "afternoon", status: "approved", hours: 4, employeeName: "Võ Thị F", employeeId: "NV006" },
    
    // Ngày 17/9/2025 - thiếu người ca sáng
    { id: "11", date: new Date("2025-09-17"), shift: "morning", status: "approved", hours: 6, employeeName: "Hoàng Văn E", employeeId: "NV005" },
    { id: "12", date: new Date("2025-09-17"), shift: "afternoon", status: "approved", hours: 4, employeeName: "Nguyễn Văn A", employeeId: "NV001" },
    { id: "13", date: new Date("2025-09-17"), shift: "afternoon", status: "approved", hours: 4, employeeName: "Trần Thị B", employeeId: "NV002" },
    { id: "14", date: new Date("2025-09-17"), shift: "afternoon", status: "approved", hours: 4, employeeName: "Lê Văn C", employeeId: "NV003" },
    { id: "15", date: new Date("2025-09-17"), shift: "night", status: "approved", hours: 3, employeeName: "Phạm Thị D", employeeId: "NV004" },
  ]);

  // Mock data cho nhân viên
  const [staffList, setStaffList] = useState<StaffMember[]>([
    { 
      id: "NV001", name: "Nguyễn Văn A", position: "Barista", shift: "Sáng", performance: "excellent", 
      salary: 8000000, phone: "0901234567", email: "nva@coffeehouse.com",
      username: "nguyenvana", password: "123456", role: "staff", accountStatus: "active",
      lastLogin: new Date("2025-09-12T08:30:00"), createdAt: new Date("2024-01-15")
    },
    { 
      id: "NV002", name: "Trần Thị B", position: "Thu ngân", shift: "Chiều", performance: "good", 
      salary: 7500000, phone: "0901234568", email: "ttb@coffeehouse.com",
      username: "tranthib", password: "123456", role: "pos", accountStatus: "active",
      lastLogin: new Date("2025-09-11T14:20:00"), createdAt: new Date("2024-02-10")
    },
    { 
      id: "NV003", name: "Lê Văn C", position: "Barista", shift: "Tối", performance: "average", 
      salary: 7000000, phone: "0901234569", email: "lvc@coffeehouse.com",
      username: "levanc", password: "123456", role: "staff", accountStatus: "inactive",
      lastLogin: new Date("2025-09-05T19:45:00"), createdAt: new Date("2024-03-20")
    },
    { 
      id: "NV004", name: "Phạm Thị D", position: "Phục vụ", shift: "Sáng", performance: "excellent", 
      salary: 6500000, phone: "0901234570", email: "ptd@coffeehouse.com",
      username: "phamthid", password: "123456", role: "staff", accountStatus: "active",
      lastLogin: new Date("2025-09-12T06:15:00"), createdAt: new Date("2024-04-05")
    },
    { 
      id: "NV005", name: "Hoàng Văn E", position: "Barista", shift: "Tối", performance: "good", 
      salary: 7200000, phone: "0901234571", email: "hve@coffeehouse.com",
      username: "hoangvane", password: "123456", role: "staff", accountStatus: "locked",
      lastLogin: new Date("2025-09-08T20:30:00"), createdAt: new Date("2024-05-12")
    },
    { 
      id: "NV006", name: "Võ Thị F", position: "Phục vụ", shift: "Chiều", performance: "excellent", 
      salary: 6800000, phone: "0901234572", email: "vtf@coffeehouse.com",
      username: "vothif", password: "123456", role: "pos", accountStatus: "active",
      lastLogin: new Date("2025-09-12T15:00:00"), createdAt: new Date("2024-06-18")
    },
    { 
      id: "POS001", name: "Máy POS #1", position: "Máy POS", shift: "Linh hoạt", performance: "excellent", 
      salary: 0, phone: "N/A", email: "pos1@coffeehouse.com",
      username: "pos_machine_1", password: "pos123456", role: "pos", accountStatus: "active",
      lastLogin: new Date("2025-09-12T16:30:00"), createdAt: new Date("2024-01-01")
    },
    { 
      id: "POS002", name: "Máy POS #2", position: "Máy POS", shift: "Linh hoạt", performance: "excellent", 
      salary: 0, phone: "N/A", email: "pos2@coffeehouse.com",
      username: "pos_machine_2", password: "pos123456", role: "pos", accountStatus: "active",
      lastLogin: new Date("2025-09-12T14:15:00"), createdAt: new Date("2024-01-01")
    },
  ]);

  const getStaffingStatus = (date: Date, shift: ShiftType) => {
    const dateStr = date.toDateString();
    const shiftsOnDate = approvedSchedules.filter(
      schedule => schedule.date.toDateString() === dateStr && schedule.shift === shift
    );
    
    const requirement = STAFFING_REQUIREMENTS.find(req => req.shift === shift);
    if (!requirement) return { status: "unknown", count: 0, required: 0, min: 0 };

    const currentCount = shiftsOnDate.length;
    let status: "sufficient" | "overstaffed" | "understaffed" | "critical" = "sufficient";

    if (currentCount < requirement.minStaff) {
      status = "critical";
    } else if (currentCount < requirement.requiredStaff) {
      status = "understaffed";
    } else if (currentCount > requirement.requiredStaff) {
      status = "overstaffed";
    }

    return {
      status,
      count: currentCount,
      required: requirement.requiredStaff,
      min: requirement.minStaff,
      staff: shiftsOnDate
    };
  };

  const getDateStaffingSummary = (date: Date) => {
    const summary = SHIFTS.map(shift => ({
      shift: shift.id as ShiftType,
      shiftName: shift.name,
      ...getStaffingStatus(date, shift.id as ShiftType)
    }));
    
    return summary;
  };

  const getCalendarEvents = () => {
    // Tạo events cho calendar hiển thị tổng quan
    const events: any[] = [];
    
    // Lấy tất cả các ngày có lịch làm việc
    const datesWithSchedules = [...new Set(approvedSchedules.map(s => s.date.toDateString()))];
    
    datesWithSchedules.forEach(dateStr => {
      const date = new Date(dateStr);
      const summary = getDateStaffingSummary(date);
      
      // Tạo event tổng quan cho mỗi ngày
      const criticalCount = summary.filter(s => s.status === "critical").length;
      const understaffedCount = summary.filter(s => s.status === "understaffed").length;
      const overstaffedCount = summary.filter(s => s.status === "overstaffed").length;
      
      let title = "";
      let color = "#22c55e"; // green - sufficient
      
      if (criticalCount > 0) {
        title = `⚠️ ${criticalCount} ca thiếu nghiêm trọng`;
        color = "#dc2626"; // red
      } else if (understaffedCount > 0) {
        title = `⚡ ${understaffedCount} ca thiếu người`;
        color = "#f59e0b"; // yellow
      } else if (overstaffedCount > 0) {
        title = `📈 ${overstaffedCount} ca dư người`;
        color = "#3b82f6"; // blue
      } else {
        title = "✅ Đủ nhân sự";
      }
      
      events.push({
        id: `summary-${dateStr}`,
        title,
        start: date,
        end: date,
        allDay: true,
        resource: { type: "summary", date, summary },
        color
      });
    });
    
    return events;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceText = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'Xuất sắc';
      case 'good': return 'Tốt';
      case 'average': return 'Trung bình';
      default: return 'Chưa đánh giá';
    }
  };

  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'locked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Ngừng hoạt động';
      case 'locked': return 'Bị khóa';
      default: return 'Không xác định';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'staff': return 'Nhân viên';
      case 'pos': return 'Máy POS';
      default: return 'Không xác định';
    }
  };

  const generateUsername = (name: string) => {
    // Tạo username từ tên (bỏ dấu và khoảng trắng)
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '');
  };

  const generatePassword = () => {
    // Tạo mật khẩu ngẫu nhiên 8 ký tự
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const toggleAccountStatus = (staffId: string) => {
    setStaffList(prev => prev.map(staff => {
      if (staff.id === staffId) {
        let newStatus: "active" | "inactive" | "locked";
        if (staff.accountStatus === "active") {
          newStatus = "inactive";
        } else if (staff.accountStatus === "inactive") {
          newStatus = "active";
        } else {
          newStatus = "active"; // unlock
        }
        return { ...staff, accountStatus: newStatus };
      }
      return staff;
    }));
  };

  const getFilteredStaffList = () => {
    if (staffFilter === "all") return staffList;
    return staffList.filter(staff => staff.role === staffFilter);
  };

  const resetPassword = (staffId: string) => {
    const newPassword = generatePassword();
    setStaffList(prev => prev.map(staff => {
      if (staff.id === staffId) {
        return { ...staff, password: newPassword };
      }
      return staff;
    }));
    alert(`Mật khẩu mới cho ${staffList.find(s => s.id === staffId)?.name}: ${newPassword}`);
  };

  const createNewStaff = () => {
    if (!newStaffData.name || !newStaffData.position || !newStaffData.phone || !newStaffData.email) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const newId = `NV${String(staffList.length + 1).padStart(3, '0')}`;
    const username = newStaffData.username || generateUsername(newStaffData.name);
    const password = newStaffData.password || generatePassword();

    const newStaff: StaffMember = {
      id: newId,
      name: newStaffData.name,
      position: newStaffData.position,
      shift: newStaffData.shift || "Linh hoạt",
      performance: newStaffData.performance || "average",
      salary: newStaffData.salary || 6000000,
      phone: newStaffData.phone,
      email: newStaffData.email,
      username,
      password,
      role: newStaffData.role || "staff",
      accountStatus: newStaffData.accountStatus || "active",
      createdAt: new Date(),
    };

    setStaffList(prev => [...prev, newStaff]);
    setNewStaffData({
      role: "staff",
      accountStatus: "active",
      performance: "average"
    });
    setIsCreatingStaff(false);
    
    alert(`Tài khoản đã được tạo!\nTên đăng nhập: ${username}\nMật khẩu: ${password}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Tổng quan lịch</TabsTrigger>
          <TabsTrigger value="staff">Quản lý nhân viên</TabsTrigger>
        </TabsList>

        {/* Tổng quan lịch làm việc */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
                  <p className="text-2xl font-medium">{staffList.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ca thiếu người</p>
                  <p className="text-2xl font-medium text-red-600">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ca đủ người</p>
                  <p className="text-2xl font-medium text-green-600">12</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ca dư người</p>
                  <p className="text-2xl font-medium text-blue-600">2</p>
                </div>
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
          </div>

          {/* Calendar Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Tổng quan lịch làm việc - Tháng 9/2025
              </CardTitle>
              <CardDescription>
                Hiển thị tình trạng nhân sự theo ngày và ca làm việc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "500px" }}>
                <style>
                  {`
                    .rbc-calendar {
                      font-family: inherit;
                    }
                    .rbc-toolbar {
                      margin-bottom: 16px;
                      padding: 0 8px;
                    }
                    .rbc-toolbar button {
                      background: white;
                      border: 1px solid #e5e7eb;
                      border-radius: 6px;
                      padding: 6px 12px;
                      font-size: 14px;
                      margin: 0 2px;
                    }
                    .rbc-toolbar button:hover {
                      background: #f3f4f6;
                    }
                    .rbc-toolbar button.rbc-active {
                      background: #030213;
                      color: white;
                    }
                    .rbc-month-view {
                      border: 1px solid #e5e7eb;
                      border-radius: 8px;
                      overflow: hidden;
                    }
                    .rbc-header {
                      background: #f9fafb;
                      padding: 12px 8px;
                      font-weight: 500;
                      border-bottom: 1px solid #e5e7eb;
                      text-align: center;
                    }
                    .rbc-date-cell {
                      padding: 8px;
                      text-align: center;
                      border-right: 1px solid #f3f4f6;
                      border-bottom: 1px solid #f3f4f6;
                    }
                    .rbc-date-cell.rbc-off-range {
                      color: #9ca3af;
                      background: #f9fafb;
                    }
                    .rbc-today {
                      background: #eff6ff !important;
                    }
                    .rbc-today .rbc-button-link {
                      color: #2563eb;
                      font-weight: 600;
                    }
                    .rbc-event {
                      font-size: 11px;
                      line-height: 1.2;
                      margin: 1px 2px;
                      border-radius: 4px;
                      padding: 2px 4px;
                    }
                  `}
                </style>
                <Calendar
                  localizer={localizer}
                  events={getCalendarEvents()}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.color,
                      borderColor: event.color,
                      color: 'white'
                    }
                  })}
                  onSelectEvent={(event) => {
                    if (event.resource?.type === "summary") {
                      setSelectedDate(event.resource.date);
                    }
                  }}
                  views={["month"]}
                  defaultView="month"
                  defaultDate={new Date("2025-09-01")}
                  messages={{
                    next: "Tiếp",
                    previous: "Trước",
                    today: "Hôm nay",
                    month: "Tháng",
                    week: "Tuần",
                    day: "Ngày"
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chi tiết ngày được chọn */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Chi tiết ngày {selectedDate.toLocaleDateString('vi-VN')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getDateStaffingSummary(selectedDate).map((shift) => (
                    <div key={shift.shift} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <div>
                            <h4 className="font-medium">{shift.shiftName}</h4>
                            <p className="text-sm text-gray-600">
                              {SHIFTS.find(s => s.id === shift.shift)?.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            shift.status === "critical" ? "destructive" :
                            shift.status === "understaffed" ? "secondary" :
                            shift.status === "overstaffed" ? "outline" : "default"
                          }>
                            {shift.count}/{shift.required} người
                          </Badge>
                          {shift.status === "critical" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {shift.status === "understaffed" && <UserMinus className="h-4 w-4 text-yellow-500" />}
                          {shift.status === "overstaffed" && <UserPlus className="h-4 w-4 text-blue-500" />}
                          {shift.status === "sufficient" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      
                      {shift.staff && shift.staff.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Nhân viên đã đăng ký:</h5>
                          <div className="grid gap-2">
                            {shift.staff.map((staff) => (
                              <div key={staff.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{staff.employeeName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {staff.hours}h
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {shift.status === "critical" && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">
                            ⚠️ Thiếu {shift.min - shift.count} người so với yêu cầu tối thiểu
                          </p>
                        </div>
                      )}
                      
                      {shift.status === "understaffed" && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-700">
                            ⚡ Thiếu {shift.required - shift.count} người so với yêu cầu lý tưởng
                          </p>
                        </div>
                      )}
                      
                      {shift.status === "overstaffed" && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-700">
                            📈 Dư {shift.count - shift.required} người so với yêu cầu
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Quản lý nhân viên */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Danh sách nhân viên
                  </CardTitle>
                  <CardDescription>
                    Quản lý thông tin và lương nhân viên
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsCreatingStaff(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm tài khoản
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Form tạo nhân viên mới */}
                {isCreatingStaff && (
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Tạo nhân viên mới
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tên nhân viên *</Label>
                          <Input 
                            value={newStaffData.name || ""}
                            onChange={(e) => setNewStaffData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nhập tên đầy đủ"
                          />
                        </div>
                        <div>
                          <Label>Chức vụ *</Label>
                          <Select 
                            value={newStaffData.position || ""}
                            onValueChange={(value) => setNewStaffData(prev => ({ ...prev, position: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn chức vụ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Barista">Barista</SelectItem>
                              <SelectItem value="Thu ngân">Thu ngân</SelectItem>
                              <SelectItem value="Phục vụ">Phục vụ</SelectItem>
                              <SelectItem value="Quản lý ca">Quản lý ca</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Số điện thoại *</Label>
                          <Input 
                            value={newStaffData.phone || ""}
                            onChange={(e) => setNewStaffData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="0901234567"
                          />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input 
                            value={newStaffData.email || ""}
                            onChange={(e) => setNewStaffData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@coffeehouse.com"
                          />
                        </div>
                        <div>
                          <Label>Lương cơ bản</Label>
                          <Input 
                            type="number" 
                            value={newStaffData.salary || ""}
                            onChange={(e) => setNewStaffData(prev => ({ ...prev, salary: Number(e.target.value) }))}
                            placeholder="6000000"
                          />
                        </div>
                        <div>
                          <Label>Ca làm ưu tiên</Label>
                          <Select 
                            value={newStaffData.shift || ""}
                            onValueChange={(value) => setNewStaffData(prev => ({ ...prev, shift: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn ca" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sáng">Ca sáng</SelectItem>
                              <SelectItem value="Chiều">Ca chiều</SelectItem>
                              <SelectItem value="Tối">Ca tối</SelectItem>
                              <SelectItem value="Linh hoạt">Linh hoạt</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Thông tin tài khoản */}
                      <div className="border-t pt-4">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Thông tin tài khoản
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Tên đăng nhập</Label>
                            <Input 
                              value={newStaffData.username || (newStaffData.name ? generateUsername(newStaffData.name) : "")}
                              onChange={(e) => setNewStaffData(prev => ({ ...prev, username: e.target.value }))}
                              placeholder="Tự động tạo từ tên"
                            />
                            <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo từ tên</p>
                          </div>
                          <div>
                            <Label>Vai trò hệ thống</Label>
                            <Select 
                              value={newStaffData.role || "staff"}
                              onValueChange={(value) => setNewStaffData(prev => ({ ...prev, role: value as "staff" | "pos" }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="staff">Nhân viên</SelectItem>
                                <SelectItem value="pos">Máy POS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Mật khẩu</Label>
                            <Input 
                              value={newStaffData.password || ""}
                              onChange={(e) => setNewStaffData(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Để trống để tự động tạo"
                            />
                            <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo mật khẩu 8 ký tự</p>
                          </div>
                          <div>
                            <Label>Trạng thái tài khoản</Label>
                            <Select 
                              value={newStaffData.accountStatus || "active"}
                              onValueChange={(value) => setNewStaffData(prev => ({ ...prev, accountStatus: value as "active" | "inactive" | "locked" }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={createNewStaff}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Tạo nhân viên
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setIsCreatingStaff(false);
                          setNewStaffData({
                            role: "staff",
                            accountStatus: "active",
                            performance: "average"
                          });
                        }}>
                          Hủy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {staffList.map((staff) => (
                  <div key={staff.id} className="p-4 border rounded-lg">
                    {editingStaff === staff.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Tên nhân viên</Label>
                            <Input defaultValue={staff.name} />
                          </div>
                          <div>
                            <Label>Chức vụ</Label>
                            <Select defaultValue={staff.position}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Barista">Barista</SelectItem>
                                <SelectItem value="Thu ngân">Thu ngân</SelectItem>
                                <SelectItem value="Phục vụ">Phục vụ</SelectItem>
                                <SelectItem value="Quản lý ca">Quản lý ca</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Số điện thoại</Label>
                            <Input defaultValue={staff.phone} />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input defaultValue={staff.email} />
                          </div>
                          <div>
                            <Label>Lương cơ bản</Label>
                            <Input type="number" defaultValue={staff.salary} />
                          </div>
                          <div>
                            <Label>Ca làm ưu tiên</Label>
                            <Select defaultValue={staff.shift}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sáng">Ca sáng</SelectItem>
                                <SelectItem value="Chiều">Ca chiều</SelectItem>
                                <SelectItem value="Tối">Ca tối</SelectItem>
                                <SelectItem value="Linh hoạt">Linh hoạt</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Thông tin tài khoản */}
                        <div className="border-t pt-4">
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Thông tin tài khoản
                          </h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Tên đăng nhập</Label>
                              <Input defaultValue={staff.username} />
                            </div>
                            <div>
                              <Label>Vai trò hệ thống</Label>
                              <Select defaultValue={staff.role}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="staff">Nhân viên</SelectItem>
                                  <SelectItem value="pos">Máy POS</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Mật khẩu</Label>
                              <div className="flex gap-2">
                                <Input 
                                  type={showPassword[staff.id] ? "text" : "password"}
                                  defaultValue={staff.password} 
                                />
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setShowPassword(prev => ({
                                    ...prev,
                                    [staff.id]: !prev[staff.id]
                                  }))}
                                >
                                  {showPassword[staff.id] ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label>Trạng thái tài khoản</Label>
                              <Select defaultValue={staff.accountStatus}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Hoạt động</SelectItem>
                                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                                  <SelectItem value="locked">Bị khóa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setEditingStaff(null)}>
                            Lưu thay đổi
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingStaff(null)}>
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-medium">{staff.name}</h4>
                                <Badge variant="outline">{staff.position}</Badge>
                                <Badge className={getPerformanceColor(staff.performance)}>
                                  {getPerformanceText(staff.performance)}
                                </Badge>
                                <Badge className={getAccountStatusColor(staff.accountStatus)}>
                                  {getAccountStatusText(staff.accountStatus)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Ca: {staff.shift}</span>
                                <span>Lương: {formatCurrency(staff.salary)}</span>
                                <span>{staff.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setEditingStaff(staff.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Thông tin tài khoản */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium">@{staff.username}</p>
                                <p className="text-xs text-gray-500">{getRoleText(staff.role)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium">
                                  {showPassword[staff.id] ? staff.password : "••••••••"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {staff.lastLogin ? 
                                    `Đăng nhập cuối: ${staff.lastLogin.toLocaleDateString('vi-VN')}` :
                                    "Chưa đăng nhập"
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setShowPassword(prev => ({
                                ...prev,
                                [staff.id]: !prev[staff.id]
                              }))}
                              title={showPassword[staff.id] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                              {showPassword[staff.id] ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => resetPassword(staff.id)}
                              title="Đặt lại mật khẩu"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => toggleAccountStatus(staff.id)}
                              title={
                                staff.accountStatus === "active" ? "Vô hiệu hóa tài khoản" :
                                staff.accountStatus === "inactive" ? "Kích hoạt tài khoản" :
                                "Mở khóa tài khoản"
                              }
                            >
                              {staff.accountStatus === "active" ? 
                                <UserX className="h-4 w-4" /> : 
                                <UserPlus className="h-4 w-4" />
                              }
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}