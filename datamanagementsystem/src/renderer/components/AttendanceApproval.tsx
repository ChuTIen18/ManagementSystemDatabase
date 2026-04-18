import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";

export function AttendanceApproval() {
  const [attendances, setAttendances] = useState([
    {
      id: 1,
      employee: 'Nguyễn Văn A',
      date: '2024-09-15',
      checkIn: '08:00',
      checkOut: '17:00',
      status: 'pending',
      shift: 'Ca sáng'
    },
    {
      id: 2,
      employee: 'Trần Thị B',
      date: '2024-09-15',
      checkIn: '13:00',
      checkOut: '21:00',
      status: 'pending',
      shift: 'Ca chiều'
    },
    {
      id: 3,
      employee: 'Lê Văn C',
      date: '2024-09-15',
      checkIn: '08:15',
      checkOut: '17:30',
      status: 'approved',
      shift: 'Ca sáng'
    }
  ]);

  const handleApprove = (id: number) => {
    setAttendances(attendances.map(att =>
      att.id === id ? {...att, status: 'approved'} : att
    ));
  };

  const handleReject = (id: number) => {
    setAttendances(attendances.map(att =>
      att.id === id ? {...att, status: 'rejected'} : att
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Duyệt chấm công</h2>

        <div className="space-y-4">
          {attendances.map((attendance) => (
            <div key={attendance.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{attendance.employee}</h3>
                    <Badge variant={getStatusColor(attendance.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(attendance.status)}
                        <span className="capitalize">
                          {attendance.status === 'pending' ? 'Chờ duyệt' :
                           attendance.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{attendance.shift}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{attendance.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Giờ làm: {attendance.checkIn} - {attendance.checkOut}</p>
                </div>
              </div>

              {attendance.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(attendance.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Từ chối
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(attendance.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Duyệt
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