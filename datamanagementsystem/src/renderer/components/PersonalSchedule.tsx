import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export function PersonalSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState([
    {
      id: 1,
      date: '2024-09-15',
      day: 'Thứ Hai',
      startTime: '08:00',
      endTime: '12:00',
      shift: 'Ca sáng',
      location: 'Quầy barista',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2024-09-16',
      day: 'Thứ Ba',
      startTime: '13:00',
      endTime: '17:00',
      shift: 'Ca chiều',
      location: 'Quầy barista',
      status: 'confirmed'
    },
    {
      id: 3,
      date: '2024-09-17',
      day: 'Thứ Tư',
      startTime: '08:00',
      endTime: '12:00',
      shift: 'Ca sáng',
      location: 'Quầy barista',
      status: 'pending'
    }
  ]);

  const handleRegister = (id: number) => {
    setSchedule(schedule.map(s =>
      s.id === id ? {...s, status: 'confirmed'} : s
    ));
  };

  const handleCancel = (id: number) => {
    setSchedule(schedule.map(s =>
      s.id === id ? {...s, status: 'cancelled'} : s
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Lịch làm việc cá nhân</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Ngày hiện tại</p>
              <p className="font-medium">{selectedDate.toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Ca làm việc</p>
              <p className="font-medium">Ca sáng (08:00 - 12:00)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <MapPin className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Vị trí</p>
              <p className="font-medium">Quầy barista</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {schedule.map((shift) => (
            <div key={shift.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{shift.shift}</h3>
                    <Badge variant={shift.status === 'confirmed' ? 'default' : shift.status === 'pending' ? 'secondary' : 'destructive'}>
                      {shift.status === 'confirmed' ? 'Đã xác nhận' : shift.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{shift.day}, {shift.date}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{shift.startTime} - {shift.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{shift.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {shift.status === 'pending' && (
                    <Button size="sm" onClick={() => handleRegister(shift.id)}>Xác nhận</Button>
                  )}
                  {shift.status === 'confirmed' && (
                    <Button size="sm" variant="outline" onClick={() => handleCancel(shift.id)}>Hủy</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}