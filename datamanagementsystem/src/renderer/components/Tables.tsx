import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Edit3, Trash2, Table, Users, Clock } from "lucide-react";

export function Tables() {
  const [tables, setTables] = useState([
    { id: 1, name: 'Bàn 1', status: 'available', capacity: 4, location: 'Khu vực trong nhà' },
    { id: 2, name: 'Bàn 2', status: 'occupied', capacity: 2, location: 'Khu vực trong nhà' },
    { id: 3, name: 'Bàn 3', status: 'reserved', capacity: 6, location: 'Khu vực trong nhà' },
    { id: 4, name: 'Bàn 4', status: 'available', capacity: 4, location: 'Khu vực trong nhà' },
    { id: 5, name: 'Bàn 5', status: 'occupied', capacity: 8, location: 'Khu vực ban công' },
    { id: 6, name: 'Bàn 6', status: 'available', capacity: 2, location: 'Khu vực ban công' },
  ]);

  const [editingTable, setEditingTable] = useState<any>(null);
  const [newTable, setNewTable] = useState({
    name: '',
    capacity: 4,
    location: 'Khu vực trong nhà'
  });

  const handleAddTable = () => {
    if (newTable.name) {
      const table = {
        id: tables.length + 1,
        ...newTable,
        status: 'available'
      };
      setTables([...tables, table]);
      setNewTable({ name: '', capacity: 4, location: 'Khu vực trong nhà' });
    }
  };

  const handleUpdateTable = () => {
    if (editingTable) {
      setTables(tables.map(table =>
        table.id === editingTable.id ? editingTable : table
      ));
      setEditingTable(null);
    }
  };

  const handleDeleteTable = (id: number) => {
    setTables(tables.filter(table => table.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quản lý bàn ghế</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm bàn
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Table className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">{table.name}</h3>
                </div>
                <Badge variant={table.status === 'available' ? 'default' : table.status === 'occupied' ? 'destructive' : 'secondary'}>
                  {table.status === 'available' ? 'Trống' : table.status === 'occupied' ? 'Đang dùng' : 'Đã đặt'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{table.capacity} người</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{table.location}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingTable(table)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteTable(table.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Table Form */}
      {editingTable && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Chỉnh sửa bàn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tên bàn</label>
              <Input
                value={editingTable.name}
                onChange={(e) => setEditingTable({...editingTable, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Số lượng người</label>
              <Input
                type="number"
                value={editingTable.capacity}
                onChange={(e) => setEditingTable({...editingTable, capacity: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Vị trí</label>
              <Input
                value={editingTable.location}
                onChange={(e) => setEditingTable({...editingTable, location: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Trạng thái</label>
              <select
                value={editingTable.status}
                onChange={(e) => setEditingTable({...editingTable, status: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="available">Trống</option>
                <option value="occupied">Đang dùng</option>
                <option value="reserved">Đã đặt</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleUpdateTable}>Lưu thay đổi</Button>
            <Button variant="outline" onClick={() => setEditingTable(null)}>Hủy</Button>
          </div>
        </Card>
      )}

      {/* Add New Table Form */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Thêm bàn mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tên bàn</label>
            <Input
              placeholder="Nhập tên bàn"
              value={newTable.name}
              onChange={(e) => setNewTable({...newTable, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Số lượng người</label>
            <Input
              type="number"
              placeholder="Nhập số lượng"
              value={newTable.capacity}
              onChange={(e) => setNewTable({...newTable, capacity: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Vị trí</label>
            <Input
              placeholder="Nhập vị trí"
              value={newTable.location}
              onChange={(e) => setNewTable({...newTable, location: e.target.value})}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddTable}>Thêm bàn</Button>
      </Card>
    </div>
  );
}