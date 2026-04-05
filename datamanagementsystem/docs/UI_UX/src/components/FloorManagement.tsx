import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { 
  Users, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  RefreshCw,
  Utensils
} from "lucide-react";

interface FloorData {
  id: number;
  name: string;
  totalTables: number;
  availableSeats: number;
  occupiedTables: number;
  estimatedCapacity: number;
  status: 'available' | 'near-full' | 'full';
  lastUpdated: Date;
}

interface InvoiceData {
  id: string;
  tableNumber?: string;
  items: number; // số lượng món
  amount: number;
  timestamp: Date;
  floor: number;
}

export function FloorManagement() {
  const [floors, setFloors] = useState<FloorData[]>([
    {
      id: 1,
      name: "Tầng 1",
      totalTables: 15,
      availableSeats: 25,
      occupiedTables: 8,
      estimatedCapacity: 60,
      status: 'near-full',
      lastUpdated: new Date()
    },
    {
      id: 2,
      name: "Tầng 2", 
      totalTables: 12,
      availableSeats: 15,
      occupiedTables: 5,
      estimatedCapacity: 48,
      status: 'available',
      lastUpdated: new Date()
    },
    {
      id: 3,
      name: "Tầng 3",
      totalTables: 10,
      availableSeats: 5,
      occupiedTables: 8,
      estimatedCapacity: 40,
      status: 'near-full',
      lastUpdated: new Date()
    }
  ]);

  const [invoices] = useState<InvoiceData[]>([
    { id: 'INV001', tableNumber: 'Bàn 3', items: 4, amount: 120000, timestamp: new Date(), floor: 1 },
    { id: 'INV002', tableNumber: 'Bàn 7', items: 2, amount: 83000, timestamp: new Date(), floor: 1 },
    { id: 'INV003', tableNumber: 'Bàn 12', items: 6, amount: 156000, timestamp: new Date(), floor: 2 },
    { id: 'INV004', tableNumber: 'Bàn 5', items: 3, amount: 95000, timestamp: new Date(), floor: 2 },
    { id: 'INV005', tableNumber: 'Bàn 8', items: 5, amount: 145000, timestamp: new Date(), floor: 3 },
  ]);

  const [selectedFloor, setSelectedFloor] = useState<FloorData | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [newAvailableSeats, setNewAvailableSeats] = useState<number>(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: FloorData['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'near-full': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: FloorData['status']) => {
    switch (status) {
      case 'available': return 'Còn chỗ';
      case 'near-full': return 'Gần đầy';
      case 'full': return 'Hết chỗ';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status: FloorData['status']) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'near-full': return <AlertCircle className="h-4 w-4" />;
      case 'full': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const estimateFloorCapacity = (floor: FloorData) => {
    const occupancyRate = (floor.occupiedTables / floor.totalTables) * 100;
    if (occupancyRate >= 90) return 'full';
    if (occupancyRate >= 70) return 'near-full';
    return 'available';
  };

  const openUpdateDialog = (floor: FloorData) => {
    setSelectedFloor(floor);
    setNewAvailableSeats(floor.availableSeats);
    setShowUpdateDialog(true);
  };

  const updateFloorCapacity = () => {
    if (selectedFloor) {
      const updatedFloors = floors.map(floor => 
        floor.id === selectedFloor.id 
          ? {
              ...floor,
              availableSeats: newAvailableSeats,
              status: newAvailableSeats === 0 ? 'full' as const : 
                      newAvailableSeats <= 10 ? 'near-full' as const : 'available' as const,
              lastUpdated: new Date()
            }
          : floor
      );
      setFloors(updatedFloors);
      setShowUpdateDialog(false);
      setSelectedFloor(null);
    }
  };

  const getFloorInvoices = (floorId: number) => {
    return invoices.filter(invoice => invoice.floor === floorId);
  };

  const viewSecurityCamera = (floorId: number) => {
    alert(`Đang mở camera tầng ${floorId}...`);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1>Quản lý tầng</h1>
          <p className="text-muted-foreground">Theo dõi tình trạng chỗ ngồi và hóa đơn theo tầng</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Cập nhật
        </Button>
      </div>

      {/* Tổng quan nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {floors.map((floor) => (
          <Card key={floor.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{floor.name}</h3>
              <Badge className={getStatusColor(floor.status)}>
                {getStatusIcon(floor.status)}
                <span className="ml-1">{getStatusText(floor.status)}</span>
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tổng bàn:</span>
                <span className="font-medium">{floor.totalTables}</span>
              </div>
              <div className="flex justify-between">
                <span>Bàn đang phục vụ:</span>
                <span className="font-medium text-blue-600">{floor.occupiedTables}</span>
              </div>
              <div className="flex justify-between">
                <span>Chỗ ngồi còn lại:</span>
                <span className={`font-medium ${
                  floor.availableSeats === 0 ? 'text-red-600' :
                  floor.availableSeats <= 10 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {floor.availableSeats} chỗ
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Cập nhật:</span>
                <span>{formatTime(floor.lastUpdated)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUpdateDialog(floor)}
                className="flex-1"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Cập nhật
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => viewSecurityCamera(floor.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Chi tiết hóa đơn theo tầng */}
      <Card className="p-4">
        <h3 className="mb-4">Hóa đơn theo tầng</h3>
        
        <Tabs defaultValue="1" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {floors.map((floor) => (
              <TabsTrigger key={floor.id} value={floor.id.toString()}>
                {floor.name} ({getFloorInvoices(floor.id).length})
              </TabsTrigger>
            ))}
          </TabsList>

          {floors.map((floor) => (
            <TabsContent key={floor.id} value={floor.id.toString()}>
              <div className="space-y-3">
                {getFloorInvoices(floor.id).length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Chưa có hóa đơn nào tại {floor.name}
                  </p>
                ) : (
                  getFloorInvoices(floor.id).map((invoice) => (
                    <Card key={invoice.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Utensils className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{invoice.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {invoice.tableNumber} • {invoice.items} món • {formatTime(invoice.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(invoice.amount)}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}

                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tổng doanh thu {floor.name}:</span>
                    <span className="font-medium text-primary">
                      {formatPrice(
                        getFloorInvoices(floor.id).reduce((sum, inv) => sum + inv.amount, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Dialog cập nhật tình trạng tầng */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật tình trạng {selectedFloor?.name}</DialogTitle>
            <DialogDescription>
              Cập nhật số chỗ ngồi còn lại để theo dõi tình trạng tầng chính xác
            </DialogDescription>
          </DialogHeader>
          {selectedFloor && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Tình trạng hiện tại:</strong> {getStatusText(selectedFloor.status)}
                </p>
                <p className="text-sm">
                  <strong>Bàn đang phục vụ:</strong> {selectedFloor.occupiedTables}/{selectedFloor.totalTables}
                </p>
                <p className="text-sm">
                  <strong>Chỗ ngồi hiện tại:</strong> {selectedFloor.availableSeats} chỗ
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Số chỗ ngồi còn lại:
                </label>
                <Input
                  type="number"
                  min="0"
                  max={selectedFloor.estimatedCapacity}
                  value={newAvailableSeats}
                  onChange={(e) => setNewAvailableSeats(Number(e.target.value))}
                  placeholder="Nhập số chỗ ngồi còn lại"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tối đa: {selectedFloor.estimatedCapacity} chỗ
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateDialog(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={updateFloorCapacity}
                  className="flex-1"
                >
                  Cập nhật
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}