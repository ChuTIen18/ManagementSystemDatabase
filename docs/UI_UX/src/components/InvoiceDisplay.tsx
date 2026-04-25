import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { QrCode, Printer, Download } from "lucide-react";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Invoice {
  id: string;
  timestamp: Date;
  cashier: string;
  items: InvoiceItem[];
  subtotal: number;
  discount?: {
    type: string;
    amount: number;
  };
  total: number;
  paymentMethod: 'cash' | 'transfer';
  table?: string;
  customer?: string;
}

interface InvoiceDisplayProps {
  invoice: Invoice;
  showQR?: boolean;
  onPrint?: () => void;
  onDownload?: () => void;
}

export function InvoiceDisplay({ invoice, showQR = true, onPrint, onDownload }: InvoiceDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const generateQRUrl = () => {
    // URL để khách hàng đánh giá - sẽ mở form đánh giá
    return `${window.location.origin}/feedback/${invoice.id}`;
  };

  return (
    <Card className="max-w-sm mx-auto bg-white">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold">COFFEE HOUSE</h2>
          <p className="text-sm text-muted-foreground">
            123 Đường ABC, Quận 1, TP.HCM
          </p>
          <p className="text-sm text-muted-foreground">
            Tel: (028) 1234 5678
          </p>
        </div>

        <Separator />

        {/* Invoice Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Mã hóa đơn:</span>
            <span className="font-medium">{invoice.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Ngày giờ:</span>
            <span>{formatDateTime(invoice.timestamp)}</span>
          </div>
          <div className="flex justify-between">
            <span>Thu ngân:</span>
            <span>{invoice.cashier}</span>
          </div>
          {invoice.table && (
            <div className="flex justify-between">
              <span>Bàn:</span>
              <span>{invoice.table}</span>
            </div>
          )}
          {invoice.customer && (
            <div className="flex justify-between">
              <span>Khách hàng:</span>
              <span>{invoice.customer}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Items */}
        <div className="space-y-3">
          <h3 className="font-medium">Chi tiết đơn hàng:</h3>
          {invoice.items.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-muted-foreground">x{item.quantity}</span>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
              {item.notes && (
                <p className="text-xs text-muted-foreground italic ml-2">
                  Ghi chú: {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>{formatPrice(invoice.subtotal)}</span>
          </div>
          
          {invoice.discount && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá ({invoice.discount.type}):</span>
              <span>-{formatPrice(invoice.discount.amount)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-medium text-base">
            <span>Tổng cộng:</span>
            <span>{formatPrice(invoice.total)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Thanh toán:</span>
            <span>{invoice.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
          </div>
        </div>

        {showQR && (
          <>
            <Separator />
            
            {/* QR Code for feedback */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">Quét mã QR để đánh giá dịch vụ</p>
                <p>Nhận ngay phiếu khuyến mãi sau khi đánh giá!</p>
              </div>
            </div>
          </>
        )}

        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
          <p>Hẹn gặp lại quý khách lần sau!</p>
        </div>

        {/* Action buttons for digital version */}
        {(onPrint || onDownload) && (
          <>
            <Separator />
            <div className="flex gap-2">
              {onPrint && (
                <Button variant="outline" size="sm" onClick={onPrint} className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  In hóa đơn
                </Button>
              )}
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Tải về
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}