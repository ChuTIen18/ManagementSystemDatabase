import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  UserCheck,
  Timer,
  MapPin,
  Play,
  Square,
} from "lucide-react";

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
  shift: string;
  hours: number;
  status: "present" | "late" | "absent";
}

const SHIFTS = [
  { id: "morning", name: "Ca sáng", time: "06:00 - 12:00", color: "bg-yellow-100 text-yellow-800" },
  { id: "noon", name: "Ca trưa", time: "12:00 - 16:00", color: "bg-orange-100 text-orange-800" },
  { id: "afternoon", name: "Ca chiều", time: "16:00 - 20:00", color: "bg-blue-100 text-blue-800" },
  { id: "night", name: "Ca tối", time: "20:00 - 23:00", color: "bg-purple-100 text-purple-800" },
];

export function AttendanceOnly() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentShift, setCurrentShift] = useState("morning");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  
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
    {
      id: "3",
      date: new Date("2024-12-07"),
      checkIn: "16:00",
      checkOut: "20:00",
      shift: "afternoon",
      hours: 4,
      status: "present",
    },
    {
      id: "4",
      date: new Date("2024-12-06"),
      checkIn: "20:10",
      checkOut: "23:00",
      shift: "night",
      hours: 2.83,
      status: "late",
    },
    {
      id: "5",
      date: new Date("2024-12-05"),
      checkIn: "12:00",
      checkOut: "16:00",
      shift: "noon",
      hours: 4,
      status: "present",
    },
  ]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFingerprint = () => {
    const now = getCurrentTime();
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(now);
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  const getTodayHours = () => {
    if (isCheckedIn && checkInTime) {
      const [checkHour, checkMin] = checkInTime.split(':').map(Number);
      const [currentHour, currentMin] = getCurrentTime().split(':').map(Number);
      
      const checkMinutes = checkHour * 60 + checkMin;
      const currentMinutes = currentHour * 60 + currentMin;
      
      const diffMinutes = currentMinutes - checkMinutes;
      return (diffMinutes / 60).toFixed(1);
    }
    return "0";
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Giờ làm hôm nay</p>
              <p className="text-2xl font-medium">{getTodayHours()}h</p>
            </div>
            <Timer className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <p className="text-lg font-medium">
                {isCheckedIn ? "Đang làm" : "Nghỉ"}
              </p>
            </div>
            {isCheckedIn ? 
              <Play className="h-8 w-8 text-green-600" /> : 
              <Square className="h-8 w-8 text-gray-400" />
            }
          </div>
        </Card>
      </div>

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
            <div 
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                isCheckedIn ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={handleFingerprint}
            >
              <UserCheck className={`h-16 w-16 ${isCheckedIn ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {isCheckedIn ? 'Nhấn để chấm công ra ca' : 'Đặt ngón tay lên máy quét để chấm công vào ca'}
              </p>
              
              <Badge variant={isCheckedIn ? "default" : "outline"} className={isCheckedIn ? "text-green-600" : ""}>
                {isCheckedIn ? `Đã chấm công vào lúc ${checkInTime}` : 'Sẵn sàng quét'}
              </Badge>
              
              {isCheckedIn && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Đã làm việc: {getTodayHours()} giờ
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Shift Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Thông tin ca làm việc hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-900">
                {SHIFTS.find(s => s.id === currentShift)?.name}
              </p>
              <p className="text-sm text-blue-700">
                {SHIFTS.find(s => s.id === currentShift)?.time}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700">Thời gian hiện tại</p>
              <p className="font-medium text-blue-900">{getCurrentTime()}</p>
            </div>
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

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tóm tắt tuần này</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">32h</p>
              <p className="text-sm text-green-700">Giờ làm việc</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-blue-700">Ngày đi làm</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">2</p>
              <p className="text-sm text-yellow-700">Lần đi trễ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}