import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, Edit3, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export function FinancialManagement() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'revenue',
      amount: 120000,
      description: 'Bán hàng - Hóa đơn #001',
      date: '2024-09-15',
      category: 'Bán hàng'
    },
    {
      id: 2,
      type: 'expense',
      amount: 35000,
      description: 'Mua nguyên liệu cà phê',
      date: '2024-09-15',
      category: 'Nguyên liệu'
    },
    {
      id: 3,
      type: 'revenue',
      amount: 83000,
      description: 'Bán hàng - Hóa đơn #002',
      date: '2024-09-15',
      category: 'Bán hàng'
    },
    {
      id: 4,
      type: 'expense',
      amount: 15000,
      description: 'Bảo trì máy pha cà phê',
      date: '2024-09-15',
      category: 'Bảo trì'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'revenue',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: ''
  });

  const totalRevenue = transactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.amount > 0) {
      const transaction = {
        id: transactions.length + 1,
        ...newTransaction
      };
      setTransactions([...transactions, transaction]);
      setNewTransaction({
        type: 'revenue',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: ''
      });
    }
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getTransactionColor = (type: string) => {
    return type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'revenue' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Quản lý tài chính</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm giao dịch
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doanh thu</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chi phí</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lợi nhuận</p>
                <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{transaction.description}</h3>
                    <Badge variant={getTransactionColor(transaction.type)}>
                      <div className="flex items-center gap-1">
                        {getTransactionIcon(transaction.type)}
                        <span className="capitalize">
                          {transaction.type === 'revenue' ? 'Doanh thu' : 'Chi phí'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{transaction.date}</span>
                    <span>{transaction.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteTransaction(transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Transaction Form */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Thêm giao dịch mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Loại giao dịch</label>
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="revenue">Doanh thu</option>
              <option value="expense">Chi phí</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Số tiền</label>
            <Input
              type="number"
              placeholder="Nhập số tiền"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Input
              placeholder="Nhập mô tả giao dịch"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Ngày</label>
            <Input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Danh mục</label>
            <Input
              placeholder="Nhập danh mục"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddTransaction}>Thêm giao dịch</Button>
      </Card>
    </div>
  );
}