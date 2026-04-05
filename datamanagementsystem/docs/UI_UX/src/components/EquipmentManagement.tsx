import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  AlertTriangle, 
  Wrench, 
  CheckCircle, 
  Clock, 
  Plus,
  Settings,
  Zap,
  Coffee,
  Thermometer,
  Wifi
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type: 'coffee-machine' | 'grinder' | 'refrigerator' | 'pos' | 'wifi' | 'other';
  location: string;
  model: string;
  purchaseDate: Date;
  warrantyExpiry: Date;
  status: 'working' | 'maintenance' | 'broken' | 'offline';
  lastMaintenance: Date;
  nextMaintenance: Date;
}

interface MaintenanceReport {
  id: string;
  equipmentId: string;
  reportedBy: string;
  issueType: 'malfunction' | 'maintenance' | 'cleaning' | 'repair';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'reported' | 'in-progress' | 'resolved' | 'closed';
  reportedAt: Date;
  resolvedAt?: Date;
  technician?: string;
  solution?: string;
}

export function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 'EQ001',
      name: 'Máy pha cà phê số 1',
      type: 'coffee-machine',
      location: 'Quầy bar chính',
      model: 'Breville Oracle Touch',
      purchaseDate: new Date('2023-01-15'),
      warrantyExpiry: new Date('2025-01-15'),
      status: 'working',
      lastMaintenance: new Date('2024-01-15'),
      nextMaintenance: new Date('2024-04-15')
    },
    {
      id: 'EQ002',
      name: 'Máy xay cà phê',
      type: 'grinder',
      location: 'Quầy bar chính',
      model: 'Baratza Vario',
      purchaseDate: new Date('2023-02-01'),
      warrantyExpiry: new Date('2025-02-01'),
      status: 'broken',
      lastMaintenance: new Date('2024-01-01'),
      nextMaintenance: new Date('2024-04-01')
    },
    {
      id: 'EQ003',
      name: 'Tủ lạnh số 1',
      type: 'refrigerator',
      location: 'Khu vực lưu trữ',
      model: 'Samsung RF23M8070SR',
      purchaseDate: new Date('2022-12-01'),
      warrantyExpiry: new Date('2024-12-01'),
      status: 'working',
      lastMaintenance: new Date('2024-01-10'),
      nextMaintenance: new Date('2024-04-10')
    },
    {
      id: 'EQ004',
      name: 'Hệ thống WiFi',
      type: 'wifi',
      location: 'Tầng 1',
      model: 'TP-Link Archer AX73',
      purchaseDate: new Date('2023-06-01'),
      warrantyExpiry: new Date('2026-06-01'),
      status: 'offline',
      lastMaintenance: new Date('2024-01-05'),
      nextMaintenance: new Date('2024-07-05')
    }
  ]);

  const [reports, setReports] = useState<MaintenanceReport[]>([
    {
      id: 'RPT001',
      equipmentId: 'EQ002',
      reportedBy: 'Nhân viên A',
      issueType: 'malfunction',
      severity: 'high',
      description: 'Máy xay cà phê không hoạt động, có tiếng kêu lạ',
      status: 'reported',
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'RPT002',
      equipmentId: 'EQ004',
      reportedBy: 'Nhân viên B',
      issueType: 'malfunction',
      severity: 'medium',
      description: 'WiFi mất kết nối liên tục, khách hàng phàn nàn',
      status: 'in-progress',
      reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      technician: 'Kỹ thuật viên C'
    }
  ]);

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [reportForm, setReportForm] = useState({
    issueType: 'malfunction' as MaintenanceReport['issueType'],
    severity: 'medium' as MaintenanceReport['severity'],
    description: ''
  });

  const equipmentTypes = [
    { value: 'coffee-machine', label: 'Máy pha cà phê', icon: Coffee },
    { value: 'grinder', label: 'Máy xay', icon: Settings },
    { value: 'refrigerator', label: 'Tủ lạnh', icon: Thermometer },
    { value: 'pos', label: 'Máy POS', icon: Zap },
    { value: 'wifi', label: 'WiFi/Mạng', icon: Wifi },
    { value: 'other', label: 'Khác', icon: Wrench }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'broken': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Equipment['status']) => {
    switch (status) {
      case 'working': return 'Hoạt động tốt';
      case 'maintenance': return 'Đang bảo trì';
      case 'broken': return 'Hỏng hóc';
      case 'offline': return 'Tạm ngừng';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status: Equipment['status']) => {
    switch (status) {
      case 'working': return <CheckCircle className="h-4 w-4" />;
      case 'maintenance': return <Clock className="h-4 w-4" />;
      case 'broken': return <AlertTriangle className="h-4 w-4" />;
      case 'offline': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: MaintenanceReport['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportStatusColor = (status: MaintenanceReport['status']) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBrokenEquipment = () => {
    return equipment.filter(eq => eq.status === 'broken' || eq.status === 'offline');
  };

  const getPendingReports = () => {
    return reports.filter(report => ['reported', 'in-progress'].includes(report.status));
  };

  const getOverdueMaintenanceEquipment = () => {
    const now = new Date();
    return equipment.filter(eq => eq.nextMaintenance < now && eq.status === 'working');
  };

  const submitReport = () => {
    if (!selectedEquipment || !reportForm.description.trim()) return;

    const newReport: MaintenanceReport = {
      id: `RPT${Date.now()}`,
      equipmentId: selectedEquipment.id,
      reportedBy: 'Nhân viên hiện tại',
      issueType: reportForm.issueType,
      severity: reportForm.severity,
      description: reportForm.description,
      status: 'reported',
      reportedAt: new Date()
    };

    setReports([newReport, ...reports]);

    // Update equipment status if severe issue
    if (reportForm.severity === 'critical' || reportForm.severity === 'high') {
      setEquipment(equipment.map(eq => 
        eq.id === selectedEquipment.id 
          ? { ...eq, status: reportForm.severity === 'critical' ? 'broken' as const : 'maintenance' as const }
          : eq
      ));
    }

    console.log('Báo cáo sự cố mới:', newReport);
    
    setShowReportDialog(false);
    setSelectedEquipment(null);
    setReportForm({
      issueType: 'malfunction',
      severity: 'medium',
      description: ''
    });

    alert('Đã gửi báo cáo sự cố. Kỹ thuật viên sẽ được thông báo.');
  };

  const updateReportStatus = (reportId: string, newStatus: MaintenanceReport['status']) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date() : report.resolvedAt,
            technician: newStatus === 'in-progress' ? 'Kỹ thuật viên A' : report.technician
          }
        : report
    ));

    // Update equipment status when issue is resolved
    if (newStatus === 'resolved') {
      const report = reports.find(r => r.id === reportId);
      if (report) {
        setEquipment(equipment.map(eq => 
          eq.id === report.equipmentId 
            ? { ...eq, status: 'working' }
            : eq
        ));
      }
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header with alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>Quản lý thiết bị</h1>
            <p className="text-muted-foreground">Theo dõi tình trạng máy móc và thiết bị</p>
          </div>
          <Button onClick={() => setShowReportDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Báo cáo sự cố
          </Button>
        </div>

        {/* Alert banners */}
        <div className="space-y-3">
          {getBrokenEquipment().length > 0 && (
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">
                    Thiết bị trục trặc!
                  </p>
                  <p className="text-sm text-red-700">
                    {getBrokenEquipment().length} thiết bị đang gặp sự cố hoặc tạm ngừng
                  </p>
                </div>
                <Badge variant="destructive">
                  {getBrokenEquipment().length}
                </Badge>
              </div>
            </Card>
          )}

          {getOverdueMaintenanceEquipment().length > 0 && (
            <Card className="p-4 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">
                    Cần bảo trì định kỳ
                  </p>
                  <p className="text-sm text-yellow-700">
                    {getOverdueMaintenanceEquipment().length} thiết bị đã đến hạn bảo trì
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Tabs defaultValue="equipment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="equipment">Thiết bị</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo sự cố ({getPendingReports().length})</TabsTrigger>
          <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
        </TabsList>

        {/* Equipment list */}
        <TabsContent value="equipment" className="space-y-4">
          <div className="grid gap-4">
            {equipment.map((item) => {
              const typeInfo = equipmentTypes.find(t => t.value === item.type);
              const Icon = typeInfo?.icon || Wrench;
              
              return (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.location} • {item.model}
                        </p>
                      </div>
                    </div>

                    <Badge className={getStatusColor(item.status)}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{getStatusText(item.status)}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Mua ngày:</p>
                      <p className="font-medium">{formatDate(item.purchaseDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hết hạn bảo hành:</p>
                      <p className="font-medium">{formatDate(item.warrantyExpiry)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bảo trì lần cuối:</p>
                      <p className="font-medium">{formatDate(item.lastMaintenance)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bảo trì tiếp theo:</p>
                      <p className={`font-medium ${
                        item.nextMaintenance < new Date() ? 'text-red-600' : ''
                      }`}>
                        {formatDate(item.nextMaintenance)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEquipment(item);
                        setShowReportDialog(true);
                      }}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Báo cáo sự cố
                    </Button>
                    <Button variant="outline" size="sm">
                      <Wrench className="h-4 w-4 mr-1" />
                      Lên lịch bảo trì
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Reports list */}
        <TabsContent value="reports" className="space-y-4">
          {reports.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-medium text-green-800 mb-2">Không có sự cố</h3>
              <p className="text-muted-foreground">Tất cả thiết bị đang hoạt động bình thường</p>
            </Card>
          ) : (
            reports.map((report) => {
              const equipmentItem = equipment.find(eq => eq.id === report.equipmentId);
              return (
                <Card key={report.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{equipmentItem?.name}</h3>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity === 'critical' && 'Nghiêm trọng'}
                          {report.severity === 'high' && 'Cao'}
                          {report.severity === 'medium' && 'Trung bình'}
                          {report.severity === 'low' && 'Thấp'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Báo cáo bởi {report.reportedBy} • {formatDateTime(report.reportedAt)}
                      </p>
                      <p className="text-sm">{report.description}</p>
                      {report.technician && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Kỹ thuật viên: {report.technician}
                        </p>
                      )}
                    </div>

                    <Badge className={getReportStatusColor(report.status)}>
                      {report.status === 'reported' && 'Đã báo cáo'}
                      {report.status === 'in-progress' && 'Đang xử lý'}
                      {report.status === 'resolved' && 'Đã khắc phục'}
                      {report.status === 'closed' && 'Đã đóng'}
                    </Badge>
                  </div>

                  {report.status === 'reported' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateReportStatus(report.id, 'in-progress')}
                      >
                        Bắt đầu xử lý
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateReportStatus(report.id, 'resolved')}
                      >
                        Đánh dấu đã khắc phục
                      </Button>
                    </div>
                  )}

                  {report.status === 'in-progress' && (
                    <Button
                      size="sm"
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                    >
                      Hoàn thành sửa chữa
                    </Button>
                  )}
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Maintenance schedule */}
        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid gap-4">
            {equipment.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Bảo trì tiếp theo:</p>
                    <p className={`font-medium ${
                      item.nextMaintenance < new Date() 
                        ? 'text-red-600' 
                        : item.nextMaintenance < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}>
                      {formatDate(item.nextMaintenance)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Report issue dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Báo cáo sự cố thiết bị</DialogTitle>
            <DialogDescription>
              Mô tả chi tiết sự cố để kỹ thuật viên có thể xử lý nhanh chóng
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Thiết bị:</label>
              <Select 
                value={selectedEquipment?.id || ''} 
                onValueChange={(value) => {
                  const eq = equipment.find(e => e.id === value);
                  setSelectedEquipment(eq || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thiết bị" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name} - {eq.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Loại sự cố:</label>
              <Select 
                value={reportForm.issueType} 
                onValueChange={(value) => setReportForm({...reportForm, issueType: value as MaintenanceReport['issueType']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malfunction">Trục trặc hoạt động</SelectItem>
                  <SelectItem value="maintenance">Cần bảo trì</SelectItem>
                  <SelectItem value="cleaning">Cần vệ sinh</SelectItem>
                  <SelectItem value="repair">Cần sửa chữa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mức độ nghiêm trọng:</label>
              <Select 
                value={reportForm.severity} 
                onValueChange={(value) => setReportForm({...reportForm, severity: value as MaintenanceReport['severity']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp - Không ảnh hưởng hoạt động</SelectItem>
                  <SelectItem value="medium">Trung bình - Ảnh hưởng nhẹ</SelectItem>
                  <SelectItem value="high">Cao - Ảnh hưởng nghiêm trọng</SelectItem>
                  <SelectItem value="critical">Nghiêm trọng - Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mô tả chi tiết:</label>
              <Textarea
                placeholder="Mô tả tình trạng thiết bị, triệu chứng, thời điểm phát hiện..."
                value={reportForm.description}
                onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReportDialog(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={submitReport}
                disabled={!selectedEquipment || !reportForm.description.trim()}
                className="flex-1"
              >
                Gửi báo cáo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}