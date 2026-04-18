import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Plus, Edit3, Trash2, Settings, AlertTriangle, CheckCircle } from "lucide-react";

export function EquipmentManagement() {
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: 'Máy pha cà phê #1',
      status: 'active',
      lastMaintenance: '2 ngày trước',
      nextMaintenance: '2 tuần nữa',
      location: 'Quầy barista',
      type: 'Máy pha cà phê'
    },
    {
      id: 2,
      name: 'Máy pha cà phê #2',
      status: 'maintenance',
      lastMaintenance: 'Đang bảo trì',
      nextMaintenance: '1 tuần nữa',
      location: 'Quầy barista',
      type: 'Máy pha cà phê'
    },
    {
      id: 3,
      name: 'Máy xay cà phê',
      status: 'active',
      lastMaintenance: '1 tuần trước',
      nextMaintenance: '3 tuần nữa',
      location: 'Phòng bếp',
      type: 'Máy xay'
    },
    {
      id: 4,
      name: 'Hệ thống âm thanh',
      status: 'warning',
      lastMaintenance: '3 ngày trước',
      nextMaintenance: '1 tháng nữa',
      location: 'Khu vực trong nhà',
      type: 'Thiết bị âm thanh'
    }
  ]);

  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    type: '',
    location: '',
    lastMaintenance: '',
    nextMaintenance: ''
  });

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.type) {
      const equipmentItem = {
        id: equipment.length + 1,
        ...newEquipment,
        status: 'active'
      };
      setEquipment([...equipment, equipmentItem]);
      setNewEquipment({
        name: '',
        type: '',
        location: '',
        lastMaintenance: '',
        nextMaintenance: ''
      });
    }
  };

  const handleUpdateEquipment = () => {
    if (editingEquipment) {
      setEquipment(equipment.map(item =>
        item.id === editingEquipment.id ? editingEquipment : item
      ));
      setEditingEquipment(null);
    }
  };

  const handleDeleteEquipment = (id: number) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'warning': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quản lý thiết bị</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thiết bị
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">{item.name}</h3>
                  </div>
                  <Badge variant={getStatusColor(item.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(item.status)}
                      <span className="capitalize">
                        {item.status === 'active' ? 'Hoạt động' : item.status === 'maintenance' ? 'Bảo trì' : 'Cảnh báo'}
                      </span>
                    </div>
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Vị trí:</span>
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Bảo trì gần nhất:</span>
                  <span>{item.lastMaintenance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Bảo trì tiếp theo:</span>
                  <span>{item.nextMaintenance}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingEquipment(item)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteEquipment(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Equipment Form */}
      {editingEquipment && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Chỉnh sửa thiết bị</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tên thiết bị</label>
              <Input
                value={editingEquipment.name}
                onChange={(e) => setEditingEquipment({...editingEquipment, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Loại thiết bị</label>
              <Input
                value={editingEquipment.type}
                onChange={(e) => setEditingEquipment({...editingEquipment, type: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Vị trí</label>
              <Input
                value={editingEquipment.location}
                onChange={(e) => setEditingEquipment({...editingEquipment, location: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Bảo trì gần nhất</label>
              <Input
                value={editingEquipment.lastMaintenance}
                onChange={(e) => setEditingEquipment({...editingEquipment, lastMaintenance: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Bảo trì tiếp theo</label>
              <Input
                value={editingEquipment.nextMaintenance}
                onChange={(e) => setEditingEquipment({...editingEquipment, nextMaintenance: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleUpdateEquipment}>Lưu thay đổi</Button>
            <Button variant="outline" onClick={() => setEditingEquipment(null)}>Hủy</Button>
          </div>
        </Card>
      )}

      {/* Add New Equipment Form */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Thêm thiết bị mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tên thiết bị</label>
            <Input
              placeholder="Nhập tên thiết bị"
              value={newEquipment.name}
              onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Loại thiết bị</label>
            <Input
              placeholder="Nhập loại thiết bị"
              value={newEquipment.type}
              onChange={(e) => setNewEquipment({...newEquipment, type: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Vị trí</label>
            <Input
              placeholder="Nhập vị trí"
              value={newEquipment.location}
              onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Bảo trì gần nhất</label>
            <Input
              placeholder="Nhập ngày bảo trì"
              value={newEquipment.lastMaintenance}
              onChange={(e) => setNewEquipment({...newEquipment, lastMaintenance: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Bảo trì tiếp theo</label>
            <Input
              placeholder="Nhập ngày bảo trì tiếp theo"
              value={newEquipment.nextMaintenance}
              onChange={(e) => setNewEquipment({...newEquipment, nextMaintenance: e.target.value})}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddEquipment}>Thêm thiết bị</Button>
      </Card>
    </div>
  );
}