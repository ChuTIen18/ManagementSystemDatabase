import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Users, User, CheckCircle, XCircle } from "lucide-react";

export function ScheduleOverview() {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      employee: 'Nguyễn Văn A',
      position: 'Barista',
      date: '2024-09-15',
      shift: 'Ca sáng',
      status: 'confirmed',
      hours: '8h'
    },
    {
      id: 2,
      employee: 'Trần Thị B',
      position: 'Thu ngân',
      date: '2024-09-15',
      shift: 'Ca chiều',
      status: 'confirmed',
      hours: '8h'
    },
    {
      id: 3,
      employee: 'Lê Văn C',
      position: 'Barista',
      date: '2024-09-15',
      shift: 'Ca tối',
      status: 'pending',
      hours: '8h'
    },
    {
      id: 4,
      employee: 'Phạm Thị D',
      position: 'Phục vụ',
      date: '2024-09-15',
      shift: 'Ca sáng',
      status: 'confirmed',
      hours: '8h'
    }
  ]);

  const handleConfirm = (id: number) => {
    setSchedules(schedules.map(sched =>
      sched.id === id ? {...sched, status: 'confirmed'} : sched
    ));
  };

  const handleCancel = (id: number) => {
    setSchedules(schedules.map(sched =>
      sched.id === id ? {...sched, status: 'cancelled'} : sched
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Tổng quan lịch làm việc</h2>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Tạo lịch mới
          </Button>
        </div>

        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{schedule.employee}</h3>
                    <Badge variant={getStatusColor(schedule.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(schedule.status)}
                        <span className="capitalize">
                          {schedule.status === 'confirmed' ? 'Đã xác nhận' :
                           schedule.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{schedule.position}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{schedule.shift}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{schedule.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{schedule.hours}</p>
                </div>
              </div>

              {schedule.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancel(schedule.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleConfirm(schedule.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Xác nhận
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}