import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Coffee, Users, DollarSign, Clock } from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "Doanh thu hôm nay",
      value: "2,450,000₫",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Đơn hàng",
      value: "45",
      icon: Coffee,
      color: "text-blue-600"
    },
    {
      title: "Khách hàng",
      value: "32",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Thời gian phục vụ TB",
      value: "12 phút",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  const recentOrders = [
    { id: "#001", table: "Bàn 3", items: "2x Cappuccino, 1x Bánh mì", total: "120,000₫", status: "Đang pha" },
    { id: "#002", table: "Bàn 7", items: "1x Americano, 2x Croissant", total: "95,000₫", status: "Hoàn thành" },
    { id: "#003", table: "Bàn 1", items: "3x Latte, 1x Cheesecake", total: "165,000₫", status: "Chờ xử lý" }
  ];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="mb-2">Xin chào, Quản lý!</h1>
        <p className="text-muted-foreground">Hôm nay là ngày tuyệt vời để kinh doanh</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-medium">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="mb-4">Đơn hàng gần đây</h3>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{order.id}</span>
                  <span className="text-sm text-muted-foreground">• {order.table}</span>
                </div>
                <p className="text-sm text-muted-foreground">{order.items}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.total}</p>
                <Badge 
                  variant={order.status === "Hoàn thành" ? "default" : 
                          order.status === "Đang pha" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}