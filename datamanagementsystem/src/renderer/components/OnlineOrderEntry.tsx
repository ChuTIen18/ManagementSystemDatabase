import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Smartphone,
  Plus,
  Edit,
  Check,
  Clock,
  MapPin,
  Phone,
  Package,
  DollarSign,
} from "lucide-react";

interface OnlineOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

interface OnlineOrder {
  id: string;
  platform: string;
  platformOrderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OnlineOrderItem[];
  total: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: "cod" | "paid";
  deliveryTime: string;
  note?: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered";
  createdAt: Date;
}

export function OnlineOrderEntry() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OnlineOrder | null>(null);
  const [orders, setOrders] = useState<OnlineOrder[]>([
    {
      id: "ON001",
      platform: "Grab Food",
      platformOrderId: "GRB123456789",
      customerName: "Trần Văn B",
      customerPhone: "0987654321",
      customerAddress: "456 Đường XYZ, Quận 3, TP.HCM",
      items: [
        { id: "1", name: "Cà phê sữa", quantity: 2, price: 30000 },
        { id: "2", name: "Bánh mì", quantity: 1, price: 25000 },
      ],
      total: 85000,
      deliveryFee: 15000,
      grandTotal: 100000,
      paymentMethod: "paid",
      deliveryTime: "30-40 phút",
      note: "Ít đường",
      status: "pending",
      createdAt: new Date(),
    },
  ]);

  // Form states
  const [formData, setFormData] = useState({
    platform: "",
    platformOrderId: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    items: [{ name: "", quantity: 1, price: 0, note: "" }],
    deliveryFee: 0,
    paymentMethod: "cod" as const,
    deliveryTime: "",
    note: "",
  });

  const platforms = [
    "Grab Food",
    "ShopeeFood",
    "Gojek",
    "Baemin",
    "Now.vn",
    "Khác",
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "preparing":
        return "Đang chuẩn bị";
      case "ready":
        return "Sẵn sàng";
      case "delivered":
        return "Đã giao";
      default:
        return status;
    }
  };

  const addItemToForm = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0, note: "" }],
    }));
  };

  const updateFormItem = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeFormItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return itemsTotal + formData.deliveryFee;
  };

  const handleSubmit = () => {
    const newOrder: OnlineOrder = {
      id: `ON${(orders.length + 1).toString().padStart(3, "0")}`,
      platform: formData.platform,
      platformOrderId: formData.platformOrderId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      items: formData.items
        .filter((item) => item.name.trim())
        .map((item, index) => ({
          id: (index + 1).toString(),
          ...item,
        })),
      total: formData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      deliveryFee: formData.deliveryFee,
      grandTotal: calculateTotal(),
      paymentMethod: formData.paymentMethod,
      deliveryTime: formData.deliveryTime,
      note: formData.note,
      status: "pending",
      createdAt: new Date(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setShowAddForm(false);
    setFormData({
      platform: "",
      platformOrderId: "",
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      items: [{ name: "", quantity: 1, price: 0, note: "" }],
      deliveryFee: 0,
      paymentMethod: "cod",
      deliveryTime: "",
      note: "",
    });
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OnlineOrder["status"],
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3>Đơn hàng trực tuyến</h3>
          <p className="text-sm text-muted-foreground">
            Nhập đơn hàng từ các app thương mại điện tử
          </p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm đơn online
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm đơn hàng trực tuyến</DialogTitle>
              <DialogDescription>
                Nhập thông tin đơn hàng từ app thương mại điện tử
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Thông tin đơn hàng */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Nền tảng</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, platform: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nền tảng" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="platformOrderId">Mã đơn trên app</Label>
                  <Input
                    id="platformOrderId"
                    value={formData.platformOrderId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        platformOrderId: e.target.value,
                      }))
                    }
                    placeholder="VD: GRB123456789"
                  />
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="space-y-3">
                <h4>Thông tin khách hàng</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Tên khách hàng</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customerName: e.target.value,
                        }))
                      }
                      placeholder="Họ và tên"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Số điện thoại</Label>
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customerPhone: e.target.value,
                        }))
                      }
                      placeholder="0123456789"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerAddress">Địa chỉ giao hàng</Label>
                  <Textarea
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customerAddress: e.target.value,
                      }))
                    }
                    placeholder="Địa chỉ đầy đủ"
                    rows={2}
                  />
                </div>
              </div>

              {/* Chi tiết đơn hàng */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4>Chi tiết đơn hàng</h4>
                  <Button variant="outline" size="sm" onClick={addItemToForm}>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm món
                  </Button>
                </div>
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-end"
                  >
                    <div className="col-span-4">
                      <Label className="text-xs">Tên món</Label>
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          updateFormItem(index, "name", e.target.value)
                        }
                        placeholder="Tên món"
                        size="sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">SL</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateFormItem(
                            index,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        min="1"
                        size="sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Giá</Label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateFormItem(index, "price", Number(e.target.value))
                        }
                        placeholder="0"
                        size="sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Ghi chú</Label>
                      <Input
                        value={item.note}
                        onChange={(e) =>
                          updateFormItem(index, "note", e.target.value)
                        }
                        placeholder="Ghi chú"
                        size="sm"
                      />
                    </div>
                    <div className="col-span-1">
                      {formData.items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFormItem(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Thông tin bổ sung */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryFee">Phí giao hàng</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={formData.deliveryFee}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        deliveryFee: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryTime">Thời gian giao</Label>
                  <Input
                    id="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        deliveryTime: e.target.value,
                      }))
                    }
                    placeholder="VD: 30-40 phút"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paymentMethod">Thanh toán</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: "cod" | "paid") =>
                    setFormData((prev) => ({ ...prev, paymentMethod: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">COD (Thu hộ)</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="note">Ghi chú đơn hàng</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, note: e.target.value }))
                  }
                  placeholder="Ghi chú từ khách hàng hoặc app"
                  rows={2}
                />
              </div>

              {/* Tổng tiền */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Tổng đơn hàng:</span>
                  <span className="font-medium">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Lưu đơn hàng
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{order.platform}</span>
                  <Badge variant="outline">{order.platformOrderId}</Badge>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(order.grandTotal)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.createdAt.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {order.customerName} - {order.customerPhone}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">
                      {order.customerAddress}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-3 w-3 text-muted-foreground" />
                    <span>{order.items.length} món</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {order.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>

              {order.note && (
                <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                  <strong>Ghi chú:</strong> {order.note}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                {order.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, "confirmed")}
                  >
                    Xác nhận
                  </Button>
                )}
                {order.status === "confirmed" && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                  >
                    Bắt đầu chuẩn bị
                  </Button>
                )}
                {order.status === "preparing" && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, "ready")}
                  >
                    Sẵn sàng giao
                  </Button>
                )}
                {order.status === "ready" && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                  >
                    Đã giao
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Chưa có đơn hàng trực tuyến nào
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Nhấn "Thêm đơn online" để nhập đơn từ app thương mại điện tử
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
