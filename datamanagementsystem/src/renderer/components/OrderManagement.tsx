import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, User, Package, CheckCircle, XCircle, AlertCircle, ShoppingCart } from "lucide-react";

export function OrderManagement() {
  const [orders, setOrders] = useState([
    {
      id: '#ORD001',
      customer: 'Nguyễn Văn A',
      items: 'Cappuccino x2, Croissant x1',
      total: 120000,
      status: 'preparing',
      time: '10:30 AM',
      table: 'Bàn 3'
    },
    {
      id: '#ORD002',
      customer: 'Trần Thị B',
      items: 'Americano x1, Latte x1',
      total: 83000,
      status: 'ready',
      time: '10:45 AM',
      table: 'Bàn 7'
    },
    {
      id: '#ORD003',
      customer: 'Lê Văn C',
      items: 'Espresso x3',
      total: 105000,
      status: 'completed',
      time: '11:00 AM',
      table: 'Bàn 2'
    }
  ]);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quản lý đơn hàng</h2>
          <Button>
            <Package className="h-4 w-4 mr-2" />
            Tạo đơn mới
          </Button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">{order.id}</h3>
                    <Badge variant={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">
                          {order.status === 'preparing' ? 'Đang chuẩn bị' :
                           order.status === 'ready' ? 'Sẵn sàng' :
                           order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{order.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{order.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      <span>{order.table}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {order.total.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>

              <p className="mb-3">{order.items}</p>

              <div className="flex justify-end gap-2">
                {order.status === 'preparing' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id, 'ready')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Đặt sẵn
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Hoàn thành
                  </Button>
                )}
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Hủy
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}