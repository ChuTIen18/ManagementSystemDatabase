import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Save,
  X as XIcon,
  UserCheck,
  Calendar,
  Timer,
  Calculator,
} from "lucide-react";

type ShiftType = "morning" | "noon" | "afternoon" | "night";
type AttendanceStatus = "pending" | "approved" | "rejected" | "edited";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  date: Date;
  shift: ShiftType;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  scheduledHours: number;
  status: AttendanceStatus;
  overtime: number;
  late: number; // minutes late
  earlyLeave: number; // minutes early leave
  rejectionReason?: string;
  editedCheckIn?: string;
  editedCheckOut?: string;
  editedBy?: string;
}

const SHIFTS = [
  { id: "morning", name: "Ca sáng", time: "06:00 - 12:00", start: "06:00", end: "12:00" },
  { id: "noon", name: "Ca trưa", time: "12:00 - 16:00", start: "12:00", end: "16:00" },
  { id: "afternoon", name: "Ca chiều", time: "16:00 - 20:00", start: "16:00", end: "20:00" },
  { id: "night", name: "Ca tối", time: "20:00 - 23:00", start: "20:00", end: "23:00" },
];

export function AttendanceApproval() {
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editedCheckIn, setEditedCheckIn] = useState("");
  const [editedCheckOut, setEditedCheckOut] = useState("");

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "att1",
      employeeName: "Nguyễn Văn A",
      employeeId: "EMP001",
      date: new Date("2025-09-15"),
      shift: "morning",
      checkIn: "06:05",
      checkOut: "12:00",
      totalHours: 5.92,
      scheduledHours: 6,
      status: "pending",
      overtime: 0,
      late: 5,
      earlyLeave: 0,
    },
    {
      id: "att2",
      employeeName: "Trần Thị B",
      employeeId: "EMP002",
      date: new Date("2025-09-15"),
      shift: "afternoon",
      checkIn: "15:55",
      checkOut: "20:10",
      totalHours: 4.25,
      scheduledHours: 4,
      status: "pending",
      overtime: 10,
      late: 0,
      earlyLeave: 0,
    },
    {
      id: "att3",
      employeeName: "Lê Văn C",
      employeeId: "EMP003",
      date: new Date("2025-09-14"),
      shift: "night",
      checkIn: "20:00",
      checkOut: "22:45",
      totalHours: 2.75,
      scheduledHours: 3,
      status: "pending",
      overtime: 0,
      late: 0,
      earlyLeave: 15,
    },
    {
      id: "att4",
      employeeName: "Phạm Thị D",
      employeeId: "EMP004",
      date: new Date("2025-09-14"),
      shift: "morning",
      checkIn: "06:00",
      checkOut: "12:00",
      totalHours: 6,
      scheduledHours: 6,
      status: "approved",
      overtime: 0,
      late: 0,
      earlyLeave: 0,
    },
    {
      id: "att5",
      employeeName: "Hoàng Văn E",
      employeeId: "EMP005",
      date: new Date("2025-09-13"),
      shift: "afternoon",
      checkIn: "16:15",
      checkOut: "19:30",
      totalHours: 3.25,
      scheduledHours: 4,
      status: "rejected",
      overtime: 0,
      late: 15,
      earlyLeave: 30,
      rejectionReason: "Đi muộn và về sớm quá nhiều, không đạt giờ quy định"
    },
  ]);

  const calculateHours = (checkIn: string, checkOut: string): number => {
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    
    let totalMinutes = outMinutes - inMinutes;
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts
    
    return Math.round((totalMinutes / 60) * 100) / 100;
  };

  const calculateLateness = (actualCheckIn: string, scheduledCheckIn: string): number => {
    const [actualHour, actualMin] = actualCheckIn.split(':').map(Number);
    const [scheduledHour, scheduledMin] = scheduledCheckIn.split(':').map(Number);
    
    const actualMinutes = actualHour * 60 + actualMin;
    const scheduledMinutes = scheduledHour * 60 + scheduledMin;
    
    return Math.max(0, actualMinutes - scheduledMinutes);
  };

  const calculateEarlyLeave = (actualCheckOut: string, scheduledCheckOut: string): number => {
    const [actualHour, actualMin] = actualCheckOut.split(':').map(Number);
    const [scheduledHour, scheduledMin] = scheduledCheckOut.split(':').map(Number);
    
    const actualMinutes = actualHour * 60 + actualMin;
    const scheduledMinutes = scheduledHour * 60 + scheduledMin;
    
    return Math.max(0, scheduledMinutes - actualMinutes);
  };

  const approveRecord = (recordId: string) => {
    setAttendanceRecords(records =>
      records.map(record =>
        record.id === recordId ? { ...record, status: "approved" } : record
      )
    );
  };

  const rejectRecord = (recordId: string, reason: string) => {
    setAttendanceRecords(records =>
      records.map(record =>
        record.id === recordId ? { 
          ...record, 
          status: "rejected", 
          rejectionReason: reason 
        } : record
      )
    );
    setRejectionReason("");
  };

  const startEditRecord = (record: AttendanceRecord) => {
    setEditingRecord(record.id);
    setEditedCheckIn(record.editedCheckIn || record.checkIn);
    setEditedCheckOut(record.editedCheckOut || record.checkOut);
  };

  const saveEditRecord = (recordId: string) => {
    const record = attendanceRecords.find(r => r.id === recordId);
    if (!record) return;

    const shift = SHIFTS.find(s => s.id === record.shift);
    if (!shift) return;

    const newTotalHours = calculateHours(editedCheckIn, editedCheckOut);
    const newLate = calculateLateness(editedCheckIn, shift.start);
    const newEarlyLeave = calculateEarlyLeave(editedCheckOut, shift.end);
    const newOvertime = Math.max(0, newTotalHours - record.scheduledHours);

    setAttendanceRecords(records =>
      records.map(r =>
        r.id === recordId ? {
          ...r,
          editedCheckIn,
          editedCheckOut,
          totalHours: newTotalHours,
          late: newLate,
          earlyLeave: newEarlyLeave,
          overtime: newOvertime,
          status: "edited",
          editedBy: "Staff"
        } : r
      )
    );

    setEditingRecord(null);
    setEditedCheckIn("");
    setEditedCheckOut("");
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    setEditedCheckIn("");
    setEditedCheckOut("");
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "edited":
        return "bg-blue-100 text-blue-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: AttendanceStatus) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Bị từ chối";
      case "edited":
        return "Đã chỉnh sửa";
      case "pending":
      default:
        return "Chờ duyệt";
    }
  };

  const getIssuesText = (record: AttendanceRecord) => {
    const issues = [];
    if (record.late > 0) issues.push(`Muộn ${record.late}p`);
    if (record.earlyLeave > 0) issues.push(`Về sớm ${record.earlyLeave}p`);
    if (record.totalHours < record.scheduledHours * 0.8) issues.push("Thiếu giờ");
    if (record.overtime > 30) issues.push(`OT ${Math.round(record.overtime)}p`);
    return issues.length > 0 ? issues.join(", ") : "Bình thường";
  };

  const getIssuesSeverity = (record: AttendanceRecord) => {
    if (record.late > 15 || record.earlyLeave > 30 || record.totalHours < record.scheduledHours * 0.8) {
      return "high";
    }
    if (record.late > 0 || record.earlyLeave > 0 || record.overtime > 30) {
      return "medium";
    }
    return "low";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
      default:
        return "text-green-600 bg-green-100";
    }
  };

  const pendingRecords = attendanceRecords.filter(record => record.status === "pending");
  const approvedRecords = attendanceRecords.filter(record => record.status === "approved");
  const rejectedRecords = attendanceRecords.filter(record => record.status === "rejected");
  const editedRecords = attendanceRecords.filter(record => record.status === "edited");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Duyệt giờ chấm công</h2>
          <p className="text-muted-foreground">
            Xem và duyệt bản ghi chấm công từ máy quét vân tay
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">
            {pendingRecords.length} chờ duyệt
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chờ duyệt</p>
              <p className="text-2xl font-medium text-yellow-600">{pendingRecords.length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã duyệt</p>
              <p className="text-2xl font-medium text-green-600">{approvedRecords.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã chỉnh sửa</p>
              <p className="text-2xl font-medium text-blue-600">{editedRecords.length}</p>
            </div>
            <Edit className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bị từ chối</p>
              <p className="text-2xl font-medium text-red-600">{rejectedRecords.length}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Chờ duyệt ({pendingRecords.length})</TabsTrigger>
          <TabsTrigger value="approved">Đã xử lý</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Bản ghi chấm công chờ duyệt
              </CardTitle>
              <CardDescription>
                Duyệt hoặc chỉnh sửa thời gian chấm công từ máy quét vân tay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRecords.map((record) => {
                  const shift = SHIFTS.find(s => s.id === record.shift);
                  const severity = getIssuesSeverity(record);
                  const displayCheckIn = record.editedCheckIn || record.checkIn;
                  const displayCheckOut = record.editedCheckOut || record.checkOut;

                  return (
                    <div key={record.id} className="border rounded-lg p-4">
                      {editingRecord === record.id ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{record.employeeName}</p>
                              <p className="text-sm text-gray-600">
                                {record.date.toLocaleDateString()} - {shift?.name}
                              </p>
                            </div>
                            <Badge className={getStatusColor(record.status)}>
                              {getStatusText(record.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Giờ vào</Label>
                              <Input
                                type="time"
                                value={editedCheckIn}
                                onChange={(e) => setEditedCheckIn(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Giờ ra</Label>
                              <Input
                                type="time"
                                value={editedCheckOut}
                                onChange={(e) => setEditedCheckOut(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm">
                              <strong>Tổng giờ mới:</strong> {calculateHours(editedCheckIn, editedCheckOut)}h
                              {shift && (
                                <>
                                  {" | "}
                                  <strong>Muộn:</strong> {calculateLateness(editedCheckIn, shift.start)}p
                                  {" | "}
                                  <strong>Về sớm:</strong> {calculateEarlyLeave(editedCheckOut, shift.end)}p
                                </>
                              )}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveEditRecord(record.id)}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Lưu
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              <XIcon className="h-4 w-4 mr-1" />
                              Hủy
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-medium">{record.employeeName}</p>
                                <p className="text-sm text-gray-600">ID: {record.employeeId}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="font-medium">
                                    {record.date.toLocaleDateString()} - {shift?.name}
                                  </p>
                                  <p className="text-sm text-gray-600">{shift?.time}</p>
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(record.status)}>
                              {getStatusText(record.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Giờ vào</p>
                              <p className="font-medium">{displayCheckIn}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Giờ ra</p>
                              <p className="font-medium">{displayCheckOut}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tổng giờ</p>
                              <p className="font-medium">{record.totalHours}h / {record.scheduledHours}h</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Vấn đề</p>
                              <p className={`px-2 py-1 rounded text-xs ${getSeverityColor(severity)}`}>
                                {getIssuesText(record)}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveRecord(record.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditRecord(record)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Chỉnh sửa
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
                                  <DialogTitle>Từ chối bản ghi chấm công</DialogTitle>
                                  <DialogDescription>
                                    Nhập lý do từ chối bản ghi chấm công của {record.employeeName}
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
                                      onClick={() => rejectRecord(record.id, rejectionReason)}
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
                      )}
                    </div>
                  );
                })}

                {pendingRecords.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Timer className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Không có bản ghi chấm công nào cần duyệt</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bản ghi đã xử lý</CardTitle>
              <CardDescription>
                Các bản ghi chấm công đã được duyệt, chỉnh sửa hoặc từ chối
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...approvedRecords, ...editedRecords, ...rejectedRecords]
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((record) => {
                    const shift = SHIFTS.find(s => s.id === record.shift);
                    const displayCheckIn = record.editedCheckIn || record.checkIn;
                    const displayCheckOut = record.editedCheckOut || record.checkOut;

                    return (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{record.employeeName}</p>
                            <p className="text-sm text-gray-600">
                              {record.date.toLocaleDateString()} - {shift?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{displayCheckIn} - {displayCheckOut}</span>
                            <span className="font-medium">{record.totalHours}h</span>
                            {record.editedBy && (
                              <span className="text-blue-600 text-xs">
                                Chỉnh sửa bởi {record.editedBy}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusText(record.status)}
                          </Badge>
                          {record.rejectionReason && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Lý do từ chối</DialogTitle>
                                </DialogHeader>
                                <p>{record.rejectionReason}</p>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Thống kê tổng quan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tổng bản ghi:</span>
                  <span className="font-medium">{attendanceRecords.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Đã duyệt:</span>
                  <span className="font-medium text-green-600">{approvedRecords.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Đã chỉnh sửa:</span>
                  <span className="font-medium text-blue-600">{editedRecords.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bị từ chối:</span>
                  <span className="font-medium text-red-600">{rejectedRecords.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chờ xử lý:</span>
                  <span className="font-medium text-yellow-600">{pendingRecords.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vấn đề phổ biến</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Đi muộn:</span>
                  <span className="font-medium text-red-600">
                    {attendanceRecords.filter(r => r.late > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Về sớm:</span>
                  <span className="font-medium text-yellow-600">
                    {attendanceRecords.filter(r => r.earlyLeave > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Làm thêm giờ:</span>
                  <span className="font-medium text-blue-600">
                    {attendanceRecords.filter(r => r.overtime > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Thiếu giờ:</span>
                  <span className="font-medium text-red-600">
                    {attendanceRecords.filter(r => r.totalHours < r.scheduledHours * 0.9).length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ xử lý</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Tỷ lệ duyệt:</span>
                  <span className="font-medium text-green-600">
                    {Math.round((approvedRecords.length / attendanceRecords.length) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tỷ lệ chỉnh sửa:</span>
                  <span className="font-medium text-blue-600">
                    {Math.round((editedRecords.length / attendanceRecords.length) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tỷ lệ từ chối:</span>
                  <span className="font-medium text-red-600">
                    {Math.round((rejectedRecords.length / attendanceRecords.length) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}