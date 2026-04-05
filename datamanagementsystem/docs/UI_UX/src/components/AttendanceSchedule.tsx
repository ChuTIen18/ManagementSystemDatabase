import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import {
  Clock,
  Calendar as CalendarIcon,
  DollarSign,
  CheckCircle,
  XCircle,
  UserCheck,
  FileText,
  AlertCircle,
  Gift,
  Minus,
  Edit,
  Trash2,
  Save,
  X as XIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";

const localizer = momentLocalizer(moment);

type ShiftType = "morning" | "noon" | "afternoon" | "night";
type ScheduleStatus = "pending" | "approved" | "rejected" | "completed";

interface ShiftSlot {
  id: string;
  date: Date;
  shift: ShiftType;
  status: ScheduleStatus;
  hours: number;
}

interface SalaryInfo {
  hoursWorked: number;
  hourlyRate: number;
  bonus: number;
  penalty: number;
  totalSalary: number;
}

interface AttendanceRecord {
  id: string;
  date: Date;
  checkIn: string;
  checkOut: string;
  shift: ShiftType;
  hours: number;
  status: "present" | "late" | "absent";
}

interface LeaveRequest {
  id: string;
  date: Date;
  shift: ShiftType;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestDate: Date;
}

const SHIFTS = [
  { id: "morning", name: "Ca sáng", time: "06:00 - 12:00", color: "bg-yellow-100 text-yellow-800" },
  { id: "noon", name: "Ca trưa", time: "12:00 - 16:00", color: "bg-orange-100 text-orange-800" },
  { id: "afternoon", name: "Ca chiều", time: "16:00 - 20:00", color: "bg-blue-100 text-blue-800" },
  { id: "night", name: "Ca tối", time: "20:00 - 23:00", color: "bg-purple-100 text-purple-800" },
];

export function AttendanceSchedule() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedShift, setSelectedShift] = useState<ShiftType>("morning");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-09-15"));
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [editingLeave, setEditingLeave] = useState<string | null>(null);
  const [tempScheduleValues, setTempScheduleValues] = useState<Partial<ShiftSlot>>({});
  const [tempLeaveValues, setTempLeaveValues] = useState<Partial<LeaveRequest>>({});
  const [scheduleRequests, setScheduleRequests] = useState<ShiftSlot[]>([
    // Tháng 9/2025 - theo hình ảnh
    {
      id: "demo1",
      date: new Date("2025-09-01"),
      shift: "morning",
      status: "approved",
      hours: 6,
    },
    {
      id: "demo2", 
      date: new Date("2025-09-03"),
      shift: "afternoon",
      status: "rejected",
      hours: 4,
    },
    {
      id: "demo3",
      date: new Date("2025-09-05"),
      shift: "night",
      status: "pending",
      hours: 3,
    },
    {
      id: "demo4",
      date: new Date("2025-09-08"),
      shift: "morning",
      status: "completed",
      hours: 6,
    },
    {
      id: "demo5",
      date: new Date("2025-09-10"),
      shift: "morning",
      status: "approved",
      hours: 6,
    },
    {
      id: "demo6",
      date: new Date("2025-09-12"),
      shift: "afternoon",
      status: "completed",
      hours: 4,
    },
    {
      id: "demo7",
      date: new Date("2025-09-15"),
      shift: "night",
      status: "approved",
      hours: 3,
    },
    {
      id: "demo8",
      date: new Date("2025-09-17"),
      shift: "morning",
      status: "pending",
      hours: 6,
    },
    {
      id: "demo9",
      date: new Date("2025-09-19"),
      shift: "afternoon",
      status: "approved",
      hours: 4,
    },
    {
      id: "demo10",
      date: new Date("2025-09-22"),
      shift: "morning",
      status: "rejected",
      hours: 6,
    },
    {
      id: "demo11",
      date: new Date("2025-09-24"),
      shift: "night",
      status: "approved",
      hours: 3,
    },
    {
      id: "demo12",
      date: new Date("2025-09-26"),
      shift: "afternoon",
      status: "completed",
      hours: 4,
    },
    {
      id: "demo13",
      date: new Date("2025-09-28"),
      shift: "morning",
      status: "pending",
      hours: 6,
    },
    {
      id: "demo14",
      date: new Date("2025-09-30"),
      shift: "night",
      status: "approved",
      hours: 3,
    }
  ]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "leave1",
      date: new Date("2025-09-25"),
      shift: "morning",
      reason: "Có việc cá nhân quan trọng",
      status: "pending",
      requestDate: new Date("2025-09-20")
    },
    {
      id: "leave2",
      date: new Date("2025-09-27"),
      shift: "afternoon", 
      reason: "Đi khám bệnh định kỳ",
      status: "approved",
      requestDate: new Date("2025-09-22")
    }
  ]);
  const [leaveReason, setLeaveReason] = useState("");
  const [selectedLeaveShifts, setSelectedLeaveShifts] = useState<string[]>([]);
  
  // Mock data
  const [salaryInfo] = useState<SalaryInfo>({
    hoursWorked: 168,
    hourlyRate: 25000,
    bonus: 500000,
    penalty: 0,
    totalSalary: 4700000,
  });

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      date: new Date("2024-12-09"),
      checkIn: "06:00",
      checkOut: "12:00",
      shift: "morning",
      hours: 6,
      status: "present",
    },
    {
      id: "2",
      date: new Date("2024-12-08"),
      checkIn: "06:15",
      checkOut: "12:00",
      shift: "morning",
      hours: 5.75,
      status: "late",
    },
  ]);

  // Mock approved schedule for leave requests - tháng 9/2025
  const [approvedSchedule] = useState<ShiftSlot[]>([
    {
      id: "approved1",
      date: new Date("2025-09-16"),
      shift: "morning",
      status: "approved",
      hours: 6,
    },
    {
      id: "approved2",
      date: new Date("2025-09-18"),
      shift: "afternoon",
      status: "approved",
      hours: 4,
    },
    {
      id: "approved3",
      date: new Date("2025-09-20"),
      shift: "night",
      status: "approved",
      hours: 3,
    },
    {
      id: "approved4",
      date: new Date("2025-09-25"),
      shift: "morning",
      status: "approved",
      hours: 6,
    },
    {
      id: "approved5",
      date: new Date("2025-09-27"),
      shift: "afternoon",
      status: "approved",
      hours: 4,
    },
  ]);

  const handleScheduleRequest = () => {
    const newRequest: ShiftSlot = {
      id: Date.now().toString(),
      date: selectedDate,
      shift: selectedShift,
      status: "pending",
      hours: SHIFTS.find(s => s.id === selectedShift)?.time.includes("06:00") ? 6 : 
             SHIFTS.find(s => s.id === selectedShift)?.time.includes("12:00") ? 4 :
             SHIFTS.find(s => s.id === selectedShift)?.time.includes("16:00") ? 4 : 3,
    };
    setScheduleRequests([...scheduleRequests, newRequest]);
  };

  const cancelScheduleRequest = (requestId: string) => {
    setScheduleRequests(scheduleRequests.filter(req => req.id !== requestId));
  };

  const startEditSchedule = (request: ShiftSlot) => {
    setEditingSchedule(request.id);
    setTempScheduleValues({
      date: request.date,
      shift: request.shift,
    });
  };

  const saveScheduleEdit = (requestId: string) => {
    const updatedRequests = scheduleRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          date: tempScheduleValues.date ?? req.date,
          shift: tempScheduleValues.shift ?? req.shift,
          hours: SHIFTS.find(s => s.id === (tempScheduleValues.shift ?? req.shift))?.time.includes("06:00") ? 6 : 
                 SHIFTS.find(s => s.id === (tempScheduleValues.shift ?? req.shift))?.time.includes("12:00") ? 4 :
                 SHIFTS.find(s => s.id === (tempScheduleValues.shift ?? req.shift))?.time.includes("16:00") ? 4 : 3,
        };
      }
      return req;
    });
    setScheduleRequests(updatedRequests);
    setEditingSchedule(null);
    setTempScheduleValues({});
  };

  const cancelScheduleEdit = () => {
    setEditingSchedule(null);
    setTempScheduleValues({});
  };

  const handleLeaveRequest = () => {
    if (!leaveReason.trim() || selectedLeaveShifts.length === 0) return;

    const newLeaveRequests = selectedLeaveShifts.map(shiftId => {
      const [dateStr, shift] = shiftId.split('-');
      const shiftDate = new Date(dateStr);
      
      return {
        id: Date.now().toString() + Math.random(),
        date: shiftDate,
        shift: shift as ShiftType,
        reason: leaveReason,
        status: "pending" as const,
        requestDate: new Date(),
      };
    });

    setLeaveRequests([...leaveRequests, ...newLeaveRequests]);
    setLeaveReason("");
    setSelectedLeaveShifts([]);
  };

  const cancelLeaveRequest = (requestId: string) => {
    setLeaveRequests(leaveRequests.filter(req => req.id !== requestId));
  };

  const startEditLeave = (request: LeaveRequest) => {
    setEditingLeave(request.id);
    setTempLeaveValues({
      reason: request.reason,
    });
  };

  const saveLeaveEdit = (requestId: string) => {
    const updatedRequests = leaveRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          reason: tempLeaveValues.reason ?? req.reason,
        };
      }
      return req;
    });
    setLeaveRequests(updatedRequests);
    setEditingLeave(null);
    setTempLeaveValues({});
  };

  const cancelLeaveEdit = () => {
    setEditingLeave(null);
    setTempLeaveValues({});
  };

  const getScheduleEvents = () => {
    const allSchedules = [...scheduleRequests, ...approvedSchedule];
    return allSchedules.map(request => {
      const shiftName = SHIFTS.find(s => s.id === request.shift)?.name || "";
      const statusText = request.status === "approved" ? "✓" : 
                        request.status === "rejected" ? "✗" : 
                        request.status === "completed" ? "✓" : "?";
      
      return {
        id: request.id,
        title: `${shiftName} ${statusText}`,
        start: request.date,
        end: request.date,
        resource: request,
        allDay: true,
      };
    });
  };

  const getEventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = "#f59e0b"; // yellow for pending
    let borderColor = backgroundColor;
    
    switch (status) {
      case "approved":
        backgroundColor = "#22c55e"; // green
        break;
      case "rejected":
        backgroundColor = "#ef4444"; // red
        break;
      case "completed":
        backgroundColor = "#6b7280"; // gray
        break;
      default:
        backgroundColor = "#f59e0b"; // yellow
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: `2px solid ${backgroundColor}`,
        display: "block",
        fontSize: "11px",
        fontWeight: "500",
        padding: "2px 4px",
        margin: "1px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
    };
  };

  // Filter approved schedule for future dates (for leave requests)
  const futureApprovedSchedule = approvedSchedule.filter(
    schedule => {
      const today = new Date();
      const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      return schedule.date > twoDaysLater;
    }
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Chấm công</TabsTrigger>
          <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
          <TabsTrigger value="leave">Xin nghỉ phép</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          {/* Salary Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Trạng thái lương tháng này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{salaryInfo.hoursWorked}h</p>
                  <p className="text-sm text-gray-600">Giờ làm việc</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {salaryInfo.bonus.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Tiền thưởng</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {salaryInfo.penalty.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Tiền phạt</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {salaryInfo.totalSalary.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">Tổng lương</p>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Lương cơ bản: {salaryInfo.hourlyRate.toLocaleString()}đ/giờ
              </div>
            </CardContent>
          </Card>

          {/* Fingerprint Check-in */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Chấm công vân tay
              </CardTitle>
              <CardDescription>
                Sử dụng máy quét vân tay để chấm công vào/ra ca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Đặt ngón tay lên máy quét để chấm công
                </p>
                <Badge variant="outline" className="text-green-600">
                  Sẵn sàng quét
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử chấm công gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="font-medium">{record.date.getDate()}</p>
                        <p className="text-xs text-gray-500">Th {record.date.getMonth() + 1}</p>
                      </div>
                      <div>
                        <p className="font-medium">
                          {SHIFTS.find(s => s.id === record.shift)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {record.checkIn} - {record.checkOut} ({record.hours}h)
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={record.status === "present" ? "default" : 
                              record.status === "late" ? "secondary" : "destructive"}
                    >
                      {record.status === "present" ? "Đúng giờ" :
                       record.status === "late" ? "Trễ" : "Vắng"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          {/* Schedule Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký lịch làm việc</CardTitle>
              <CardDescription>
                Tạo yêu cầu đăng ký ca làm việc và chờ quản lý duyệt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Chọn ngày</Label>
                  <input
                    type="date"
                    value={selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      if (!isNaN(newDate.getTime())) {
                        setSelectedDate(newDate);
                      }
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <Label>Chọn ca làm việc</Label>
                  <RadioGroup value={selectedShift} onValueChange={(value) => setSelectedShift(value as ShiftType)}>
                    {SHIFTS.map((shift) => (
                      <div key={shift.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={shift.id} id={shift.id} />
                        <Label htmlFor={shift.id} className="flex-1">
                          {shift.name} ({shift.time})
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <Button onClick={handleScheduleRequest} className="w-full">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Gửi yêu cầu đăng ký
              </Button>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch làm việc tháng 9/2025</CardTitle>
              <CardDescription>
                Hiển thị trạng thái lịch làm việc theo màu sắc
              </CardDescription>
              {/* Legend theo đúng hình */}
              <div className="flex flex-wrap gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Được duyệt</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Bị từ chối</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Chờ duyệt</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Đã hoàn thành</span>
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ height: "450px" }}>
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
                    .rbc-date-cell button {
                      width: 100%;
                      padding: 4px 0;
                      border: none;
                      background: transparent;
                      font-size: 14px;
                      font-weight: 500;
                    }
                    .rbc-today {
                      background: #eff6ff !important;
                    }
                    .rbc-today .rbc-button-link {
                      color: #2563eb;
                      font-weight: 600;
                    }
                    .rbc-event {
                      font-size: 10px;
                      line-height: 1.2;
                      margin: 1px 2px;
                    }
                    .rbc-day-slot .rbc-events-container {
                      margin: 4px 2px;
                    }
                  `}
                </style>
                <Calendar
                  localizer={localizer}
                  events={getScheduleEvents()}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={getEventStyleGetter}
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

          {/* Schedule Requests List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách yêu cầu đăng ký</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleRequests.map((request) => (
                  <div key={request.id} className="p-3 border rounded-lg">
                    {editingSchedule === request.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Chọn ngày</Label>
                            <Input
                              type="date"
                              value={tempScheduleValues.date && !isNaN(tempScheduleValues.date.getTime()) ? 
                                tempScheduleValues.date.toISOString().split('T')[0] : 
                                request.date.toISOString().split('T')[0]}
                              onChange={(e) => {
                                const newDate = new Date(e.target.value);
                                if (!isNaN(newDate.getTime())) {
                                  setTempScheduleValues(prev => ({ ...prev, date: newDate }));
                                }
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Ca làm việc</Label>
                            <Select
                              value={tempScheduleValues.shift ?? request.shift}
                              onValueChange={(value) => setTempScheduleValues(prev => ({
                                ...prev,
                                shift: value as ShiftType
                              }))}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SHIFTS.map((shift) => (
                                  <SelectItem key={shift.id} value={shift.id}>
                                    {shift.name} ({shift.time})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveScheduleEdit(request.id)}>
                            <Save className="h-3 w-3 mr-1" />
                            Lưu
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelScheduleEdit}>
                            <XIcon className="h-3 w-3 mr-1" />
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {request.date && !isNaN(request.date.getTime()) ? request.date.toLocaleDateString() : 'Invalid Date'} - {SHIFTS.find(s => s.id === request.shift)?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {SHIFTS.find(s => s.id === request.shift)?.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditSchedule(request)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelScheduleRequest(request.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Badge
                            variant={request.status === "approved" ? "default" : 
                                    request.status === "rejected" ? "destructive" : "secondary"}
                          >
                            {request.status === "approved" ? "Được duyệt" :
                             request.status === "rejected" ? "Bị từ chối" : 
                             request.status === "completed" ? "Đã hoàn thành" : "Chờ duyệt"}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {scheduleRequests.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Chưa có yêu cầu đăng ký lịch làm việc nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bạn chỉ có thể xin nghỉ phép các ca đã được duyệt và phải xin trước ít nhất 2 ngày.
            </AlertDescription>
          </Alert>

          {/* Leave Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Xin nghỉ phép</CardTitle>
              <CardDescription>
                Chọn các ca đã được duyệt mà bạn muốn xin nghỉ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {futureApprovedSchedule.length > 0 ? (
                <>
                  <div>
                    <Label>Chọn ca muốn xin nghỉ</Label>
                    <div className="space-y-2 mt-2">
                      {futureApprovedSchedule.map((schedule) => {
                        const shiftInfo = SHIFTS.find(s => s.id === schedule.shift);
                        const checkboxId = `${schedule.date.toISOString()}-${schedule.shift}`;
                        
                        return (
                          <div key={schedule.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={checkboxId}
                              checked={selectedLeaveShifts.includes(checkboxId)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedLeaveShifts([...selectedLeaveShifts, checkboxId]);
                                } else {
                                  setSelectedLeaveShifts(selectedLeaveShifts.filter(id => id !== checkboxId));
                                }
                              }}
                            />
                            <Label htmlFor={checkboxId} className="flex-1">
                              {schedule.date.toLocaleDateString()} - {shiftInfo?.name} ({shiftInfo?.time})
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="leave-reason">Lý do xin nghỉ</Label>
                    <Textarea
                      id="leave-reason"
                      placeholder="Nhập lý do xin nghỉ phép..."
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleLeaveRequest} 
                    className="w-full"
                    disabled={selectedLeaveShifts.length === 0 || !leaveReason.trim()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Gửi đơn xin nghỉ phép
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Không có ca làm việc nào có thể xin nghỉ phép
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Các ca phải được duyệt và cách ít nhất 2 ngày từ hôm nay
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leave Requests History */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử xin nghỉ phép</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="p-3 border rounded-lg">
                    {editingLeave === request.id ? (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Lý do nghỉ phép</Label>
                          <Textarea
                            value={tempLeaveValues.reason ?? request.reason}
                            onChange={(e) => setTempLeaveValues(prev => ({
                              ...prev,
                              reason: e.target.value
                            }))}
                            className="min-h-[80px]"
                            placeholder="Nhập lý do nghỉ phép..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveLeaveEdit(request.id)}>
                            <Save className="h-3 w-3 mr-1" />
                            Lưu
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelLeaveEdit}>
                            <XIcon className="h-3 w-3 mr-1" />
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {request.date && !isNaN(request.date.getTime()) ? request.date.toLocaleDateString() : 'Invalid Date'} - {SHIFTS.find(s => s.id === request.shift)?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditLeave(request)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => cancelLeaveRequest(request.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Badge
                              variant={request.status === "approved" ? "default" : 
                                      request.status === "rejected" ? "destructive" : "secondary"}
                            >
                              {request.status === "approved" ? "Được duyệt" :
                               request.status === "rejected" ? "Bị từ chối" : "Chờ duyệt"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Lý do: {request.reason}
                        </p>
                        <p className="text-xs text-gray-400">
                          Ngày gửi: {request.requestDate && !isNaN(request.requestDate.getTime()) ? request.requestDate.toLocaleDateString() : 'Invalid Date'}
                        </p>
                      </>
                    )}
                  </div>
                ))}
                {leaveRequests.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Chưa có đơn xin nghỉ phép nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}