import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Award,
  Minus
} from "lucide-react";

interface Staff {
  id: string;
  name: string;
  position: string;
  hourlyRate: number;
  hoursWorked: number;
  bonus: number;
  penalty: number;
  totalSalary: number;
  performance: 'excellent' | 'good' | 'average';
  shift: string;
}

interface ScheduleRequest {
  id: string;
  staffId: string;
  staffName: string;
  date: Date;
  shift: 'morning' | 'noon' | 'afternoon' | 'night';
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
}

const SHIFTS = [
  { id: "morning", name: "Ca sáng", time: "06:00 - 12:00" },
  { id: "noon", name: "Ca trưa", time: "12:00 - 16:00" },
  { id: "afternoon", name: "Ca chiều", time: "16:00 - 20:00" },
  { id: "night", name: "Ca tối", time: "20:00 - 23:00" },
];

export function StaffManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Mock data
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: "1",
      name: "Nguyễn Văn A", 
      position: "Barista",
      hourlyRate: 25000,
      hoursWorked: 168,
      bonus: 500000,
      penalty: 0,
      totalSalary: 4700000,
      performance: "excellent",
      shift: "Sáng"
    },
    {
      id: "2", 
      name: "Trần Thị B",
      position: "Thu ngân",
      hourlyRate: 23000,
      hoursWorked: 160,
      bonus: 300000,
      penalty: 50000,
      totalSalary: 3930000,
      performance: "good",
      shift: "Chiều"
    },
    {
      id: "3",
      name: "Lê Văn C",
      position: "Barista", 
      hourlyRate: 22000,
      hoursWorked: 152,
      bonus: 200000,
      penalty: 100000,
      totalSalary: 3444000,
      performance: "average",
      shift: "Tối"
    }
  ]);

  const [scheduleRequests, setScheduleRequests] = useState<ScheduleRequest[]>([
    {
      id: "1",
      staffId: "1",
      staffName: "Nguyễn Văn A",
      date: new Date(2024, 11, 15),
      shift: "morning",
      status: "pending",
      requestDate: new Date(2024, 11, 12)
    },
    {
      id: "2", 
      staffId: "2",
      staffName: "Trần Thị B",
      date: new Date(2024, 11, 16),
      shift: "afternoon",
      status: "pending",
      requestDate: new Date(2024, 11, 13)
    },
    {
      id: "3",
      staffId: "3", 
      staffName: "Lê Văn C",
      date: new Date(2024, 11, 17),
      shift: "night",
      status: "approved",
      requestDate: new Date(2024, 11, 14)
    }
  ]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScheduleApproval = (requestId: string, approve: boolean) => {
    setScheduleRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: approve ? 'approved' : 'rejected' }
          : request
      )
    );
  };

  const updateSalaryInfo = (staffId: string, field: string, value: number) => {
    setStaffList(prev => 
      prev.map(staff => {
        if (staff.id === staffId) {
          const updated = { ...staff, [field]: value };
          // Recalculate total salary
          updated.totalSalary = (updated.hourlyRate * updated.hoursWorked) + updated.bonus - updated.penalty;
          return updated;
        }
        return staff;
      })
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Danh sách NV</TabsTrigger>
          <TabsTrigger value="salary">Quản lý lương</TabsTrigger>
          <TabsTrigger value="schedule">Duyệt lịch làm</TabsTrigger>
        </TabsList>

        {/* Danh sách nhân viên */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Danh sách nhân viên
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm nhân viên
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffList.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">{staff.name}</span>
                        <Badge variant="outline">{staff.position}</Badge>
                        <Badge className={getPerformanceColor(staff.performance)}>
                          {staff.performance === 'excellent' && 'Xuất sắc'}
                          {staff.performance === 'good' && 'Tốt'}
                          {staff.performance === 'average' && 'Trung bình'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Ca làm: {staff.shift} • {staff.hoursWorked}h/tháng
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(staff.totalSalary)}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(staff.hourlyRate)}/h</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Thống kê nhân sự */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-medium">{staffList.length}</p>
                <p className="text-sm text-muted-foreground">Tổng NV</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-medium">
                  {formatCurrency(staffList.reduce((sum, staff) => sum + staff.totalSalary, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Tổng lương</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-medium">
                  {staffList.filter(s => s.performance === 'excellent').length}
                </p>
                <p className="text-sm text-muted-foreground">Xuất sắc</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-medium">
                  {Math.round(staffList.reduce((sum, staff) => sum + staff.hoursWorked, 0) / staffList.length)}h
                </p>
                <p className="text-sm text-muted-foreground">TB giờ làm</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Quản lý tiền lương */}
        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Quản lý tiền lương
              </CardTitle>
              <CardDescription>
                Xác nhận số giờ làm và điều chỉnh tiền thưởng/phạt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffList.map((staff) => (
                  <Card key={staff.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{staff.name}</h4>
                        <p className="text-sm text-muted-foreground">{staff.position}</p>
                      </div>
                      <Badge className={getPerformanceColor(staff.performance)}>
                        {staff.performance === 'excellent' && 'Xuất sắc'}
                        {staff.performance === 'good' && 'Tốt'} 
                        {staff.performance === 'average' && 'Trung bình'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <Label className="text-xs">Lương cơ bản</Label>
                        <Input
                          type="number"
                          value={staff.hourlyRate}
                          onChange={(e) => updateSalaryInfo(staff.id, 'hourlyRate', Number(e.target.value))}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">₫/giờ</p>
                      </div>

                      <div>
                        <Label className="text-xs">Số giờ làm</Label>
                        <Input
                          type="number"
                          value={staff.hoursWorked}
                          onChange={(e) => updateSalaryInfo(staff.id, 'hoursWorked', Number(e.target.value))}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">giờ</p>
                      </div>

                      <div>
                        <Label className="text-xs">Tiền thưởng</Label>
                        <Input
                          type="number"
                          value={staff.bonus}
                          onChange={(e) => updateSalaryInfo(staff.id, 'bonus', Number(e.target.value))}
                          className="mt-1"
                        />
                        <p className="text-xs text-green-600 mt-1">+ ₫</p>
                      </div>

                      <div>
                        <Label className="text-xs">Tiền phạt</Label>
                        <Input
                          type="number"
                          value={staff.penalty}
                          onChange={(e) => updateSalaryInfo(staff.id, 'penalty', Number(e.target.value))}
                          className="mt-1"
                        />
                        <p className="text-xs text-red-600 mt-1">- ₫</p>
                      </div>

                      <div>
                        <Label className="text-xs">Tổng lương</Label>
                        <div className="mt-1 p-2 bg-muted/50 rounded border">
                          <p className="font-medium">{formatCurrency(staff.totalSalary)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Xác nhận
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Chỉnh sửa
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Duyệt lịch làm việc */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Duyệt lịch làm việc
              </CardTitle>
              <CardDescription>
                Xem và duyệt các yêu cầu đăng ký lịch làm của nhân viên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleRequests.map((request) => {
                  const shiftInfo = SHIFTS.find(s => s.id === request.shift);
                  return (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">{request.staffName}</span>
                          <Badge variant="outline">
                            {request.date.toLocaleDateString('vi-VN')}
                          </Badge>
                          <Badge variant="secondary">
                            {shiftInfo?.name} ({shiftInfo?.time})
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Yêu cầu gửi: {request.requestDate.toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'approved' && 'Đã duyệt'}
                          {request.status === 'rejected' && 'Từ chối'}
                          {request.status === 'pending' && 'Chờ duyệt'}
                        </Badge>

                        {request.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleScheduleApproval(request.id, true)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleScheduleApproval(request.id, false)}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {scheduleRequests.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không có yêu cầu lịch làm việc nào</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Thống kê lịch làm */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-medium">
                  {scheduleRequests.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Chờ duyệt</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-medium">
                  {scheduleRequests.filter(r => r.status === 'approved').length}
                </p>
                <p className="text-sm text-muted-foreground">Đã duyệt</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-medium">
                  {scheduleRequests.filter(r => r.status === 'rejected').length}
                </p>
                <p className="text-sm text-muted-foreground">Từ chối</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-medium">{scheduleRequests.length}</p>
                <p className="text-sm text-muted-foreground">Tổng yêu cầu</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}