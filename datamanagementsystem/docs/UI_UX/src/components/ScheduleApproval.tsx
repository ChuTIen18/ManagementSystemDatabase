import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
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
} from "lucide-react";

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
  { shift: "afternoon", requiredStaff: 5, minStaff: 4 },
  { shift: "night", requiredStaff: 3, minStaff: 2 },
];

export function ScheduleApproval() {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedMonth, setSelectedMonth] = useState("12");
  const [rejectionReason, setRejectionReason] = useState("");
  
  const [scheduleRequests, setScheduleRequests] = useState<ShiftSlot[]>([
    {
      id: "req1",
      date: new Date("2024-12-20"),
      shift: "morning",
      status: "pending",
      hours: 6,
      employeeName: "Nguyễn Văn A",
      employeeId: "EMP001"
    },
    {
      id: "req2",
      date: new Date("2024-12-20"),
      shift: "afternoon",
      status: "pending",
      hours: 4,
      employeeName: "Trần Thị B",
      employeeId: "EMP002"
    },
    {
      id: "req3",
      date: new Date("2024-12-21"),
      shift: "morning",
      status: "pending",
      hours: 6,
      employeeName: "Lê Văn C",
      employeeId: "EMP003"
    },
    {
      id: "req4",
      date: new Date("2024-12-22"),
      shift: "night",
      status: "approved",
      hours: 3,
      employeeName: "Phạm Thị D",
      employeeId: "EMP004"
    },
    {
      id: "req5",
      date: new Date("2024-12-20"),
      shift: "morning",
      status: "approved",
      hours: 6,
      employeeName: "Hoàng Văn E",
      employeeId: "EMP005"
    },
    {
      id: "req6",
      date: new Date("2024-12-20"),
      shift: "morning",
      status: "approved",
      hours: 6,
      employeeName: "Đinh Thị F",
      employeeId: "EMP006"
    },
    {
      id: "req7",
      date: new Date("2024-12-21"),
      shift: "afternoon",
      status: "approved",
      hours: 4,
      employeeName: "Vũ Văn G",
      employeeId: "EMP007"
    },
    {
      id: "req8",
      date: new Date("2024-12-21"),
      shift: "afternoon",
      status: "approved",
      hours: 4,
      employeeName: "Mai Thị H",
      employeeId: "EMP008"
    },
    {
      id: "req9",
      date: new Date("2024-12-21"),
      shift: "afternoon",
      status: "approved",
      hours: 4,
      employeeName: "Bùi Văn I",
      employeeId: "EMP009"
    },
  ]);

  const approveRequest = (requestId: string) => {
    setScheduleRequests(requests =>
      requests.map(req =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
  };

  const rejectRequest = (requestId: string, reason: string) => {
    setScheduleRequests(requests =>
      requests.map(req =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      )
    );
    setRejectionReason("");
  };

  const getStaffingAnalysis = (date: Date, shift: ShiftType) => {
    const dateStr = date.toDateString();
    const approvedStaff = scheduleRequests.filter(req => 
      req.date.toDateString() === dateStr && 
      req.shift === shift && 
      req.status === "approved"
    ).length;

    const requirement = STAFFING_REQUIREMENTS.find(r => r.shift === shift);
    if (!requirement) return { status: "unknown", message: "", approvedStaff: 0, required: 0 };

    if (approvedStaff < requirement.minStaff) {
      return {
        status: "understaffed",
        message: `Thiếu ${requirement.minStaff - approvedStaff} người (tối thiểu)`,
        approvedStaff,
        required: requirement.requiredStaff
      };
    } else if (approvedStaff < requirement.requiredStaff) {
      return {
        status: "below-optimal",
        message: `Thiếu ${requirement.requiredStaff - approvedStaff} người (tối ưu)`,
        approvedStaff,
        required: requirement.requiredStaff
      };
    } else if (approvedStaff > requirement.requiredStaff) {
      return {
        status: "overstaffed",
        message: `Dư ${approvedStaff - requirement.requiredStaff} người`,
        approvedStaff,
        required: requirement.requiredStaff
      };
    } else {
      return {
        status: "optimal",
        message: "Đủ người",
        approvedStaff,
        required: requirement.requiredStaff
      };
    }
  };

  const getScheduleEvents = () => {
    return scheduleRequests.map(request => ({
      id: request.id,
      title: `${request.employeeName} - ${SHIFTS.find(s => s.id === request.shift)?.name}`,
      start: request.date,
      end: request.date,
      resource: request,
    }));
  };

  const getEventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = "#6b7280";
    
    switch (status) {
      case "approved":
        backgroundColor = "#10b981";
        break;
      case "rejected":
        backgroundColor = "#ef4444";
        break;
      case "pending":
        backgroundColor = "#f59e0b";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "12px",
        padding: "2px 4px",
      },
    };
  };

  const getStaffingStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-600 bg-green-100";
      case "overstaffed":
        return "text-blue-600 bg-blue-100";
      case "below-optimal":
        return "text-yellow-600 bg-yellow-100";
      case "understaffed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStaffingIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="h-4 w-4" />;
      case "overstaffed":
        return <UserPlus className="h-4 w-4" />;
      case "below-optimal":
      case "understaffed":
        return <UserMinus className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Tạo danh sách các ngày trong tuần tới để phân tích
  const getUpcomingDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Duyệt lịch làm việc</h2>
          <p className="text-muted-foreground">
            Xem và phê duyệt các yêu cầu đăng ký lịch của nhân viên
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">Tháng 12, 2024</SelectItem>
            <SelectItem value="11">Tháng 11, 2024</SelectItem>
            <SelectItem value="10">Tháng 10, 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
          <TabsTrigger value="calendar">Lịch tổng quan</TabsTrigger>
          <TabsTrigger value="analysis">Phân tích nhân sự</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Yêu cầu chờ duyệt
              </CardTitle>
              <CardDescription>
                {scheduleRequests.filter(req => req.status === "pending").length} yêu cầu cần xử lý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleRequests
                  .filter(req => req.status === "pending")
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{request.employeeName}</p>
                            <p className="text-sm text-gray-600">ID: {request.employeeId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {request.date.toLocaleDateString()} - {SHIFTS.find(s => s.id === request.shift)?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {SHIFTS.find(s => s.id === request.shift)?.time} ({request.hours}h)
                            </p>
                          </div>
                        </div>
                        <div>
                          {(() => {
                            const analysis = getStaffingAnalysis(request.date, request.shift);
                            return (
                              <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStaffingStatusColor(analysis.status)}`}>
                                {getStaffingIcon(analysis.status)}
                                <span>{analysis.message}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Duyệt
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Từ chối yêu cầu</DialogTitle>
                              <DialogDescription>
                                Vui lòng nhập lý do từ chối yêu cầu của {request.employeeName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Lý do từ chối</Label>
                                <Textarea
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="Nhập lý do từ chối..."
                                  className="min-h-[80px]"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => rejectRequest(request.id, rejectionReason)}
                                  variant="destructive"
                                >
                                  Xác nhận từ chối
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                {scheduleRequests.filter(req => req.status === "pending").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Không có yêu cầu nào cần duyệt
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch làm việc tổng quan</CardTitle>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  Đã duyệt
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  Bị từ chối
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  Chờ duyệt
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ height: "400px" }}>
                <Calendar
                  localizer={localizer}
                  events={getScheduleEvents()}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={getEventStyleGetter}
                  views={["month"]}
                  defaultView="month"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Phân tích nhân sự 7 ngày tới
              </CardTitle>
              <CardDescription>
                Theo dõi tình trạng thiếu hụt/dư thừa nhân sự theo từng ca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getUpcomingDays().map((date, dayIndex) => (
                  <div key={dayIndex} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">
                      {date.toLocaleDateString('vi-VN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {SHIFTS.map((shift) => {
                        const analysis = getStaffingAnalysis(date, shift.id as ShiftType);
                        return (
                          <div key={shift.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{shift.name}</span>
                              <span className="text-xs text-gray-500">{shift.time}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Hiện tại:</span>
                              <span className="font-medium">{analysis.approvedStaff}/{analysis.required}</span>
                            </div>
                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStaffingStatusColor(analysis.status)}`}>
                              {getStaffingIcon(analysis.status)}
                              <span>{analysis.message}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng kết nhân sự</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {scheduleRequests.filter(req => req.status === "approved").length}
                  </p>
                  <p className="text-sm text-green-700">Ca đã duyệt</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Clock className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">
                    {scheduleRequests.filter(req => req.status === "pending").length}
                  </p>
                  <p className="text-sm text-yellow-700">Ca chờ duyệt</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {scheduleRequests.filter(req => req.status === "rejected").length}
                  </p>
                  <p className="text-sm text-red-700">Ca bị từ chối</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {[...new Set(scheduleRequests.map(req => req.employeeId))].length}
                  </p>
                  <p className="text-sm text-blue-700">Nhân viên tham gia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}