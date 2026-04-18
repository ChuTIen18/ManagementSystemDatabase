import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Plus, Edit3, Trash2, Package, AlertTriangle } from "lucide-react";

export function InventoryManagement() {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Hạt cà phê Arabica',
      current: 25,
      min: 10,
      unit: 'kg',
      status: 'good',
      cost: 150000,
      supplier: 'Công ty cà phê Việt'
    },
    {
      id: 2,
      name: 'Sữa tươi',
      current: 15,
      min: 20,
      unit: 'lít',
      status: 'low',
      cost: 35000,
      supplier: 'Nhà cung cấp sữa ABC'
    },
    {
      id: 3,
      name: 'Đường trắng',
      current: 8,
      min: 5,
      unit: 'kg',
      status: 'good',
      cost: 25000,
      supplier: 'Công ty đường XYZ'
    },
    {
      id: 4,
      name: 'Ly giấy size M',
      current: 2,
      min: 5,
      unit: 'thùng',
      status: 'critical',
      cost: 180000,
      supplier: 'Bao bì XYZ'
    }
  ]);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    current: 0,
    min: 5,
    unit: 'kg',
    cost: 0,
    supplier: ''
  });

  const handleAddItem = () => {
    if (newItem.name) {
      const item = {
        id: inventory.length + 1,
        ...newItem,
        status: newItem.current >= newItem.min ? 'good' : newItem.current > 0 ? 'low' : 'critical'
      };
      setInventory([...inventory, item]);
      setNewItem({
        name: '',
        current: 0,
        min: 5,
        unit: 'kg',
        cost: 0,
        supplier: ''
      });
    }
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      setInventory(inventory.map(item =>
        item.id === editingItem.id ? {...editingItem, status: editingItem.current >= editingItem.min ? 'good' : editingItem.current > 0 ? 'low' : 'critical'} : item
      ));
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <Package className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quản lý kho hàng</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm nguyên liệu
          </Button>
        </div>

        <div className="space-y-4">
          {inventory.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Badge variant={getStatusColor(item.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span className="capitalize">
                          {item.status === 'good' ? 'Đủ' : item.status === 'low' ? 'Sắp hết' : 'Hết hàng'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Hiện có: {item.current} {item.unit}</span>
                    <span>Đặt hàng: {item.min} {item.unit}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>Nhà cung cấp: {item.supplier}</span>
                    <span>Giá: {item.cost.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Item Form */}
      {editingItem && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Chỉnh sửa nguyên liệu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tên nguyên liệu</label>
              <Input
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Hiện có</label>
              <Input
                type="number"
                value={editingItem.current}
                onChange={(e) => setEditingItem({...editingItem, current: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Đặt hàng tối thiểu</label>
              <Input
                type="number"
                value={editingItem.min}
                onChange={(e) => setEditingItem({...editingItem, min: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Đơn vị</label>
              <select
                value={editingItem.unit}
                onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="kg">kg</option>
                <option value="lít">lít</option>
                <option value="thùng">thùng</option>
                <option value="cái">cái</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Nhà cung cấp</label>
              <Input
                value={editingItem.supplier}
                onChange={(e) => setEditingItem({...editingItem, supplier: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Giá</label>
              <Input
                type="number"
                value={editingItem.cost}
                onChange={(e) => setEditingItem({...editingItem, cost: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleUpdateItem}>Lưu thay đổi</Button>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Hủy</Button>
          </div>
        </Card>
      )}

      {/* Add New Item Form */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Thêm nguyên liệu mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tên nguyên liệu</label>
            <Input
              placeholder="Nhập tên nguyên liệu"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Hiện có</label>
            <Input
              type="number"
              placeholder="Nhập số lượng"
              value={newItem.current}
              onChange={(e) => setNewItem({...newItem, current: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Đặt hàng tối thiểu</label>
            <Input
              type="number"
              placeholder="Nhập số lượng tối thiểu"
              value={newItem.min}
              onChange={(e) => setNewItem({...newItem, min: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Đơn vị</label>
            <select
              value={newItem.unit}
              onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="kg">kg</option>
              <option value="lít">lít</option>
              <option value="thùng">thùng</option>
              <option value="cái">cái</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Nhà cung cấp</label>
            <Input
              placeholder="Nhập tên nhà cung cấp"
              value={newItem.supplier}
              onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Giá</label>
            <Input
              type="number"
              placeholder="Nhập giá"
              value={newItem.cost}
              onChange={(e) => setNewItem({...newItem, cost: Number(e.target.value)})}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddItem}>Thêm nguyên liệu</Button>
      </Card>
    </div>
  );
}