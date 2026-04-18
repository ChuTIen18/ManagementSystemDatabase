import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MessageCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function POSFeedback() {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 'FB001',
      type: 'equipment',
      description: 'Máy pha cà phê #2 đang bị lỗi',
      status: 'pending',
      reportedBy: 'NV001',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'FB002',
      type: 'supply',
      description: 'Hết đường trắng',
      status: 'resolved',
      reportedBy: 'NV002',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ]);

  const [newFeedback, setNewFeedback] = useState({
    type: 'equipment',
    description: ''
  });

  const handleReport = () => {
    if (newFeedback.description.trim()) {
      const feedback = {
        id: `FB${String(feedbacks.length + 1).padStart(3, '0')}`,
        type: newFeedback.type,
        description: newFeedback.description,
        status: 'pending',
        reportedBy: 'NV001',
        timestamp: new Date()
      };
      setFeedbacks([feedback, ...feedbacks]);
      setNewFeedback({ type: 'equipment', description: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment': return <AlertTriangle className="h-4 w-4" />;
      case 'supply': return <AlertTriangle className="h-4 w-4" />;
      case 'staff': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'equipment': return 'Thiết bị';
      case 'supply': return 'Nguyên liệu';
      case 'staff': return 'Nhân viên';
      default: return 'Khác';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Báo cáo sự cố</h2>

        <div className="mb-6">
          <h3 className="font-medium mb-3">Báo cáo mới</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Loại báo cáo</label>
              <select
                value={newFeedback.type}
                onChange={(e) => setNewFeedback({...newFeedback, type: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="equipment">Thiết bị</option>
                <option value="supply">Nguyên liệu</option>
                <option value="staff">Nhân viên</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Mô tả chi tiết</label>
              <textarea
                placeholder="Nhập mô tả chi tiết..."
                value={newFeedback.description}
                onChange={(e) => setNewFeedback({...newFeedback, description: e.target.value})}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <Button onClick={handleReport}>Gửi báo cáo</Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Danh sách báo cáo</h3>
          <div className="space-y-3">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(feedback.type)}
                    <span className="font-medium">{getTypeText(feedback.type)}</span>
                    <Badge variant={getStatusColor(feedback.status)}>
                      {feedback.status === 'pending' ? 'Chờ xử lý' :
                       feedback.status === 'resolved' ? 'Đã xử lý' : 'Đã từ chối'}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {feedback.reportedBy}
                  </span>
                </div>
                <p className="mb-2">{feedback.description}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{feedback.timestamp.toLocaleString('vi-VN')}</span>
                  <div className="flex gap-2">
                    {feedback.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Xử lý
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-1" />
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}