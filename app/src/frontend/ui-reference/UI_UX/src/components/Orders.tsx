import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, CheckCircle, AlertCircle, Users } from "lucide-react";
import { useState } from "react";

export function Orders() {
  const [selectedTab, setSelectedTab] = useState("active");

  const orders = [
    {
      id: "#001",
      table: "Bàn 3",
      customer: "Nguyễn Văn A",
      time: "10:30",
      items: [
        { name: "Cappuccino", quantity: 2, price: "45,000₫" },
        { name: "Bánh mì", quantity: 1, price: "30,000₫" }
      ],
      total: "120,000₫",
      status: "preparing",
      notes: "Ít đường"
    },
    {
      id: "#002",
      table: "Bàn 7",
      customer: "Trần Thị B",
      time: "10:45",
      items: [
        { name: "Americano", quantity: 1, price: "35,000₫" },
        { name: "Croissant", quantity: 2, price: "30,000₫" }
      ],
      total: "95,000₫",
      status: "ready",
      notes: ""
    },
    {
      id: "#003",
      table: "Bàn 1",
      customer: "Lê Văn C",
      time: "11:00",
      items: [
        { name: "Latte", quantity: 3, price: "48,000₫" },
        { name: "Cheesecake", quantity: 1, price: "55,000₫" }
      ],
      total: "199,000₫",
      status: "pending",
      notes: "Giao nhanh"
    },
    {
      id: "#004",
      table: "Bàn 5",
      customer: "Phạm Thị D",
      time: "09:15",
      items: [
        { name: "Cappuccino", quantity: 1, price: "45,000₫" }
      ],
      total: "45,000₫",
      status: "completed",
      notes: ""
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xử lý", color: "destructive", icon: AlertCircle };
      case "preparing":
        return { label: "Đang pha", color: "secondary", icon: Clock };
      case "ready":
        return { label: "Sẵn sàng", color: "default", icon: CheckCircle };
      case "completed":
        return { label: "Hoàn thành", color: "outline", icon: CheckCircle };
      default:
        return { label: "Không xác định", color: "outline", icon: AlertCircle };
    }
  };

  const filteredOrders = selectedTab === "active" 
    ? orders.filter(order => order.status !== "completed")
    : orders.filter(order => order.status === "completed");

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // Trong thực tế sẽ cập nhật state hoặc gọi API
    console.log(`Cập nhật đơn hàng ${orderId} thành ${newStatus}`);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1>Đơn hàng</h1>
        <div className="flex gap-2">
          <Button
            variant={selectedTab === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("active")}
          >
            Đang xử lý ({filteredOrders.length})
          </Button>
          <Button
            variant={selectedTab === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("completed")}
          >
            Hoàn thành
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={order.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{order.id}</h3>
                  <Badge variant={statusInfo.color as any} className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{order.time}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.table} • {order.customer}</span>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="mb-3 p-2 bg-muted/50 rounded-md">
                  <p className="text-sm">Ghi chú: {order.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="font-medium">Tổng: {order.total}</p>
                
                {order.status !== "completed" && (
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                      >
                        Bắt đầu pha
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, "ready")}
                      >
                        Sẵn sàng
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, "completed")}
                      >
                        Hoàn thành
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {selectedTab === "active" ? "Không có đơn hàng đang xử lý" : "Chưa có đơn hàng hoàn thành"}
          </p>
        </Card>
      )}
    </div>
  );
}