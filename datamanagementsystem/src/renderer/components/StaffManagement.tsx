import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { User, Users, DollarSign, Calendar, Edit3, Trash2 } from "lucide-react";

export function StaffManagement() {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      position: 'Barista',
      shift: 'Sáng',
      salary: 8000000,
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      position: 'Thu ngân',
      shift: 'Chiều',
      salary: 7500000,
      status: 'active',
      joinDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      position: 'Barista',
      shift: 'Tối',
      salary: 7000000,
      status: 'active',
      joinDate: '2024-03-10'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      position: 'Phục vụ',
      shift: 'Sáng',
      salary: 6500000,
      status: 'inactive',
      joinDate: '2024-04-05'
    }
  ]);

  const handleDeleteStaff = (id: number) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quản lý nhân viên</h2>
          <Button>
            <User className="h-4 w-4 mr-2" />
            Thêm nhân viên
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((employee) => (
            <div key={employee.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{employee.name}</h3>
                    <Badge variant={getStatusColor(employee.status)}>
                      {employee.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{employee.position}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{employee.shift}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(employee.salary)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                <span>Ngày vào làm: {employee.joinDate}</span>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteStaff(employee.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}