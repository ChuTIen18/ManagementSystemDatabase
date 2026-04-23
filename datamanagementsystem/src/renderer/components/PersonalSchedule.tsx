import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
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
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Save,
  X as XIcon,
  Clock,
  AlertCircle,
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

export function PersonalSchedule() {
  const [selectedShift, setSelectedShift] = useState<ShiftType>("morning");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [editingLeave, setEditingLeave] = useState<string | null>(null);
  const [tempScheduleValues, setTempScheduleValues] = useState<Partial<ShiftSlot>>({});
  const [tempLeaveValues, setTempLeaveValues] = useState<Partial<LeaveRequest>>({});
  const [scheduleRequests, setScheduleRequests] = useState<ShiftSlot[]>([
    {
      id: "personal1",
      date: new Date(),
      shift: "morning",
      status: "approved",
      hours: 6,
    },
    {
      id: "personal2",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      shift: "afternoon",
      status: "pending",
      hours: 4,
    },
  ]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveReason, setLeaveReason] = useState("");
  const [selectedLeaveShifts, setSelectedLeaveShifts] = useState<string[]>([]);

  const [approvedSchedule] = useState<ShiftSlot[]>([
    {
      id: "approved1",
      date: new Date("2026-04-16"),
      shift: "morning",
      status: "approved",
      hours: 6,
    },
    {
      id: "approved2",
      date: new Date("2026-04-18"),
      shift: "afternoon",
      status: "approved",
      hours: 4,
    },
    {
      id: "approved3",
      date: new Date("2026-04-20"),
      shift: "night",
      status: "approved",
      hours: 3,
    },
    {
      id: "approved4",
      date: new Date("2026-04-25"),
      shift: "morning",
      status: "approved",
      hours: 6,
    },
    {
      id: "approved5",
      date: new Date("2026-04-27"),
      shift: "afternoon",
      status: "approved",
      hours: 4,
    },
  ]);

  const getHoursFromShift = (shiftId: ShiftType): number => {
    switch (shiftId) {
      case "morning": return 6;
      case "noon": return 4;
      case "afternoon": return 4;
      case "night": return 3;
      default: return 0;
    }
  };

  const handleScheduleRequest = () => {
    const newRequest: ShiftSlot = {
      id: Date.now().toString(),
      date: selectedDate,
      shift: selectedShift,
      status: "pending",
      hours: getHoursFromShift(selectedShift),
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
          hours: getHoursFromShift(tempScheduleValues.shift ?? req.shift),
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
    let backgroundColor = "#f59e0b";

    switch (status) {
      case "approved":
        backgroundColor = "#22c55e";
        break;
      case "rejected":
        backgroundColor = "#ef4444";
        break;
      case "completed":
        backgroundColor = "#6b7280";
        break;
      default:
        backgroundColor = "#f59e0b";
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

  const futureApprovedSchedule = approvedSchedule.filter(
    schedule => {
      const today = new Date();
      const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      return schedule.date > twoDaysLater;
    }
  );

  const currentMonth = new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Đăng ký lịch làm việc cá nhân</CardTitle>
          <CardDescription>
            Tạo yêu cầu đăng ký ca làm việc và chờ quản lý duyệt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Chọn ngày</Label>
              <Input
                type="date"
                value={selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate.getTime())) {
                    setSelectedDate(newDate);
                  }
                }}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Chọn ca làm việc</Label>
              <RadioGroup value={selectedShift} onValueChange={(value) => setSelectedShift(value as ShiftType)}>
                {SHIFTS.map((shift) => (
                  <div key={shift.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={shift.id} id={shift.id} />
                    <Label htmlFor={shift.id} className="flex-1 text-sm cursor-pointer">
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

      <Card>
        <CardHeader>
          <CardTitle>Lịch làm việc cá nhân - {currentMonth}</CardTitle>
          <CardDescription>
            Hiển thị trạng thái lịch làm việc cá nhân theo màu sắc
          </CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu đăng ký cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduleRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Chưa có yêu cầu đăng ký nào
              </p>
            ) : (
              scheduleRequests.map((request) => (
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
                            {SHIFTS.find(s => s.id === request.shift)?.name} - {request.date.toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {SHIFTS.find(s => s.id === request.shift)?.time} ({request.hours}h)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={request.status === "approved" ? "default" :
                                  request.status === "rejected" ? "destructive" :
                                  request.status === "completed" ? "secondary" : "outline"}
                          className={request.status === "approved" ? "bg-green-500" : ""}
                        >
                          {request.status === "approved" ? "Được duyệt" :
                           request.status === "rejected" ? "Bị từ chối" :
                           request.status === "completed" ? "Hoàn thành" : "Chờ duyệt"}
                        </Badge>
                        {request.status === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => startEditSchedule(request)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => cancelScheduleRequest(request.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xin nghỉ phép</CardTitle>
          <CardDescription>
            Chọn các ca đã được duyệt để xin nghỉ (cần trước 2 ngày)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {futureApprovedSchedule.length > 0 ? (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Bạn chỉ có thể xin nghỉ phép các ca đã được duyệt và còn ít nhất 2 ngày.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-sm font-medium mb-2 block">Chọn ca muốn xin nghỉ</Label>
                <div className="grid gap-2 mt-2">
                  {futureApprovedSchedule.map((schedule) => {
                    const shiftId = `${schedule.date.toISOString().split('T')[0]}-${schedule.shift}`;
                    const shiftInfo = SHIFTS.find(s => s.id === schedule.shift);

                    return (
                      <div key={schedule.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={shiftId}
                          checked={selectedLeaveShifts.includes(shiftId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLeaveShifts([...selectedLeaveShifts, shiftId]);
                            } else {
                              setSelectedLeaveShifts(selectedLeaveShifts.filter(id => id !== shiftId));
                            }
                          }}
                        />
                        <Label htmlFor={shiftId} className="flex-1 text-sm cursor-pointer">
                          {schedule.date.toLocaleDateString('vi-VN')} - {shiftInfo?.name} ({shiftInfo?.time})
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="leaveReason" className="text-sm font-medium">Lý do xin nghỉ</Label>
                <Textarea
                  id="leaveReason"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Nhập lý do xin nghỉ phép..."
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleLeaveRequest}
                className="w-full"
                disabled={!leaveReason.trim() || selectedLeaveShifts.length === 0}
              >
                <Clock className="h-4 w-4 mr-2" />
                Gửi yêu cầu nghỉ phép
              </Button>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Hiện tại không có ca làm việc nào được duyệt để xin nghỉ phép.
              </AlertDescription>
            </Alert>
          )}

          {leaveRequests.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Danh sách yêu cầu nghỉ phép</h4>
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
                            className="mt-1"
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {SHIFTS.find(s => s.id === request.shift)?.name} - {request.date.toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-sm text-gray-600">{request.reason}</p>
                            <p className="text-xs text-gray-500">
                              Gửi lúc: {request.requestDate.toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={request.status === "approved" ? "default" :
                                    request.status === "rejected" ? "destructive" : "outline"}
                            className={request.status === "approved" ? "bg-green-500" : ""}
                          >
                            {request.status === "approved" ? "Được duyệt" :
                             request.status === "rejected" ? "Bị từ chối" : "Chờ duyệt"}
                          </Badge>
                          {request.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => startEditLeave(request)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => cancelLeaveRequest(request.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
