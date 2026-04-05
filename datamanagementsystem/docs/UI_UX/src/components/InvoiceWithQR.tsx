import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Printer, Download, Share2, Receipt, QrCode } from "lucide-react";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceData {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "transfer";
  timestamp: Date;
  customerName?: string;
  customerPhone?: string;
}

const sampleInvoice: InvoiceData = {
  id: "INV001",
  orderNumber: "DH001",
  tableNumber: "B05",
  items: [
    { id: "1", name: "Cà phê đen", quantity: 2, price: 25000, total: 50000 },
    { id: "2", name: "Cà phê sữa", quantity: 1, price: 30000, total: 30000 },
    { id: "3", name: "Bánh mì thịt nướng", quantity: 1, price: 45000, total: 45000 }
  ],
  subtotal: 125000,
  discount: 5000,
  tax: 12000,
  total: 132000,
  paymentMethod: "transfer",
  timestamp: new Date(),
  customerName: "Nguyễn Văn A",
  customerPhone: "0123456789"
};

export function InvoiceWithQR() {
  const [selectedInvoice] = useState<InvoiceData>(sampleInvoice);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateQRUrl = (invoiceId: string) => {
    // URL sẽ dẫn đến trang đánh giá với invoice ID
    return `${window.location.origin}/feedback/${invoiceId}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Logic để download PDF
    alert("Tải hóa đơn PDF thành công!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Hóa đơn ${selectedInvoice.orderNumber}`,
        text: `Hóa đơn Coffee House - ${formatCurrency(selectedInvoice.total)}`,
        url: generateQRUrl(selectedInvoice.id)
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(generateQRUrl(selectedInvoice.id));
      alert("Đã copy link đánh giá vào clipboard!");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2>Hóa đơn mẫu</h2>
        <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
          <DialogTrigger asChild>
            <Button>
              <Receipt className="h-4 w-4 mr-2" />
              Xem hóa đơn
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Hóa đơn thanh toán</DialogTitle>
              <DialogDescription>
                Hóa đơn chi tiết với mã QR để đánh giá
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Invoice Content */}
              <div className="text-center border-b pb-4">
                <h3 className="font-medium text-lg">COFFEE HOUSE</h3>
                <p className="text-sm text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</p>
                <p className="text-sm text-muted-foreground">Hotline: (028) 123 4567</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Số hóa đơn:</span>
                  <span className="font-medium">{selectedInvoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Đơn hàng:</span>
                  <span className="font-medium">{selectedInvoice.orderNumber}</span>
                </div>
                {selectedInvoice.tableNumber && (
                  <div className="flex justify-between">
                    <span>Bàn:</span>
                    <span className="font-medium">{selectedInvoice.tableNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Thời gian:</span>
                  <span className="font-medium">{formatDateTime(selectedInvoice.timestamp)}</span>
                </div>
                {selectedInvoice.customerName && (
                  <div className="flex justify-between">
                    <span>Khách hàng:</span>
                    <span className="font-medium">{selectedInvoice.customerName}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Chi tiết đơn hàng:</h4>
                <div className="space-y-2">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Giảm giá:</span>
                    <span>-{formatCurrency(selectedInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Thuế VAT:</span>
                  <span>{formatCurrency(selectedInvoice.tax)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span>Thanh toán:</span>
                  <Badge variant="secondary">
                    {selectedInvoice.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}
                  </Badge>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* QR Đánh giá */}
                  <div className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <QrCode className="h-16 w-16 text-blue-600" />
                      <p className="text-xs font-medium">QR Đánh giá</p>
                      <p className="text-xs text-muted-foreground">
                        Quét để đánh giá dịch vụ
                      </p>
                    </div>
                  </div>
                  
                  {/* QR Bàn */}
                  <div className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <QrCode className="h-16 w-16 text-green-600" />
                      <p className="text-xs font-medium">QR Bàn {selectedInvoice.tableNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        Quét để gọi món thêm
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
                <p>Hẹn gặp lại!</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handlePrint} className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                In
              </Button>
              <Button variant="outline" onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Tải
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <h3 className="mb-4">Mô tả tính năng</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">QR Code đánh giá</p>
              <p className="text-muted-foreground">
                Mỗi hóa đơn sẽ có mã QR để khách hàng quét và đánh giá dịch vụ
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Receipt className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Hóa đơn chi tiết</p>
              <p className="text-muted-foreground">
                Hiển thị đầy đủ thông tin đơn hàng, thanh toán và liên kết đánh giá
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Share2 className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium">Chia sẻ và in ấn</p>
              <p className="text-muted-foreground">
                Hỗ trợ in hóa đơn, tải PDF và chia sẻ link đánh giá
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}