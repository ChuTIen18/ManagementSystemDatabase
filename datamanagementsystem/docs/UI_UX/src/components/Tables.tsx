import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, Clock, Plus } from "lucide-react";
import { useState } from "react";

export function Tables() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const tables = [
    {
      id: 1,
      number: "Bàn 1",
      seats: 4,
      status: "occupied",
      customer: "Lê Văn C",
      orderTime: "11:00",
      orderValue: "199,000₫",
      duration: "45 phút"
    },
    {
      id: 2,
      number: "Bàn 2",
      seats: 2,
      status: "available",
      customer: null,
      orderTime: null,
      orderValue: null,
      duration: null
    },
    {
      id: 3,
      number: "Bàn 3",
      seats: 4,
      status: "occupied",
      customer: "Nguyễn Văn A",
      orderTime: "10:30",
      orderValue: "120,000₫",
      duration: "1h 15m"
    },
    {
      id: 4,
      number: "Bàn 4",
      seats: 6,
      status: "reserved",
      customer: "Hoàng Thị E",
      orderTime: "12:00",
      orderValue: null,
      duration: null
    },
    {
      id: 5,
      number: "Bàn 5",
      seats: 2,
      status: "available",
      customer: null,
      orderTime: null,
      orderValue: null,
      duration: null
    },
    {
      id: 6,
      number: "Bàn 6",
      seats: 4,
      status: "cleaning",
      customer: null,
      orderTime: null,
      orderValue: null,
      duration: null
    },
    {
      id: 7,
      number: "Bàn 7",
      seats: 2,
      status: "occupied",
      customer: "Trần Thị B",
      orderTime: "10:45",
      orderValue: "95,000₫",
      duration: "1h"
    },
    {
      id: 8,
      number: "Bàn 8",
      seats: 8,
      status: "available",
      customer: null,
      orderTime: null,
      orderValue: null,
      duration: null
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "available":
        return { label: "Trống", color: "default", bgColor: "bg-green-50 border-green-200" };
      case "occupied":
        return { label: "Có khách", color: "destructive", bgColor: "bg-red-50 border-red-200" };
      case "reserved":
        return { label: "Đã đặt", color: "secondary", bgColor: "bg-yellow-50 border-yellow-200" };
      case "cleaning":
        return { label: "Dọn dẹp", color: "outline", bgColor: "bg-gray-50 border-gray-200" };
      default:
        return { label: "Không xác định", color: "outline", bgColor: "bg-gray-50 border-gray-200" };
    }
  };

  const availableTables = tables.filter(table => table.status === "available").length;
  const occupiedTables = tables.filter(table => table.status === "occupied").length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1>Quản lý bàn</h1>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Đặt bàn
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <p className="text-2xl font-medium text-green-600">{availableTables}</p>
          <p className="text-sm text-muted-foreground">Bàn trống</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-medium text-red-600">{occupiedTables}</p>
          <p className="text-sm text-muted-foreground">Đang phục vụ</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-medium">{tables.length}</p>
          <p className="text-sm text-muted-foreground">Tổng số bàn</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tables.map((table) => {
          const statusInfo = getStatusInfo(table.status);

          return (
            <Card
              key={table.id}
              className={`p-4 cursor-pointer transition-all ${statusInfo.bgColor} ${
                selectedTable === table.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{table.number}</h3>
                <Badge variant={statusInfo.color as any}>
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="flex items-center gap-1 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{table.seats} chỗ ngồi</span>
              </div>

              {table.customer && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">{table.customer}</p>
                  {table.orderTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {table.orderTime} • {table.duration}
                      </span>
                    </div>
                  )}
                  {table.orderValue && (
                    <p className="text-sm font-medium text-primary">{table.orderValue}</p>
                  )}
                </div>
              )}

              {selectedTable === table.id && (
                <div className="mt-3 flex gap-2">
                  {table.status === "available" && (
                    <Button size="sm" className="flex-1">
                      Đặt bàn
                    </Button>
                  )}
                  {table.status === "occupied" && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1">
                        Xem đơn
                      </Button>
                      <Button size="sm" className="flex-1">
                        Thanh toán
                      </Button>
                    </>
                  )}
                  {table.status === "cleaning" && (
                    <Button size="sm" className="flex-1">
                      Hoàn tất dọn
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}