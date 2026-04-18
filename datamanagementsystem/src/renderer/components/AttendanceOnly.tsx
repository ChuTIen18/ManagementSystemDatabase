import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";

export function AttendanceOnly() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  // Update time every second
  setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-4">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Chấm công nhân viên</h2>
          <p className="text-muted-foreground text-center mb-6">{formatDate(currentTime)}</p>

          <div className="text-3xl font-mono mb-6">{formatTime(currentTime)}</div>

          <Button
            onClick={handleCheckIn}
            className={`text-lg px-8 py-4 ${isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isCheckedIn ? (
              <>
                <XCircle className="h-5 w-5 mr-2" />
                Chấm ra
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Chấm vào
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <Badge variant={isCheckedIn ? "default" : "secondary"}>
              {isCheckedIn ? "Đã chấm công" : "Chưa chấm công"}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold mb-4">Lịch sử chấm công</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span className="text-muted-foreground">Ca sáng</span>
            <span>08:00 - 12:00</span>
            <Badge variant="default">Hoàn thành</Badge>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span className="text-muted-foreground">Ca chiều</span>
            <span>13:00 - 17:00</span>
            <Badge variant="secondary">Chưa chấm</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}