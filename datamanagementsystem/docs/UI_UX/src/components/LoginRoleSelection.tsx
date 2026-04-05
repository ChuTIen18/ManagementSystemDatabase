import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Coffee, Users, Monitor, Clock, Mail, Key, Shield } from "lucide-react";

interface LoginRoleSelectionProps {
  onRoleSelect: (role: 'staff' | 'pos' | 'manager') => void;
}

export function LoginRoleSelection({ onRoleSelect }: LoginRoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'staff' | 'pos' | 'manager' | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [gmailAccount, setGmailAccount] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'staff' as const,
      title: 'Nhân viên',
      description: 'Chấm công, xử lý hóa đơn, báo cáo',
      icon: Users,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      loginMethod: 'Tài khoản do quản lý tạo'
    },
    {
      id: 'pos' as const,
      title: 'Máy POS',
      description: 'Gọi món, đánh giá, hoạt động cửa hàng',
      icon: Monitor,
      color: 'bg-green-50 border-green-200 text-green-700',
      loginMethod: 'Tài khoản do quản lý tạo'
    },
    {
      id: 'manager' as const,
      title: 'Quản lý',
      description: 'Quản lý kho, nhân viên, nhà cung cấp, tài chính',
      icon: Coffee,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      loginMethod: 'Gmail + Mật khẩu'
    }
  ];

  // Định nghĩa tài khoản demo hợp lệ
  const validAccounts = {
    manager: [
      { email: "manager@coffeehouse.com", password: "123456" },
      { email: "admin@coffeehouse.com", password: "admin123" }
    ],
    staff: [
      { username: "demo", password: "123456" },
      { username: "staff01", password: "123456" },
      { username: "nhanvien", password: "123456" }
    ],
    pos: [
      { username: "demo", password: "123456" },
      { username: "pos01", password: "123456" },
      { username: "maypos", password: "123456" }
    ]
  };

  const handleLogin = async () => {
    if (!selectedRole || !username || !password) {
      setLoginError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    // Giả lập thời gian xử lý
    await new Promise(resolve => setTimeout(resolve, 1000));

    let isValid = false;

    if (selectedRole === 'manager') {
      // Kiểm tra gmail + password cho quản lý
      isValid = validAccounts.manager.some(
        account => account.email === username && account.password === password
      );
    } else {
      // Kiểm tra username + password cho staff và pos
      const accounts = validAccounts[selectedRole];
      isValid = accounts.some(
        account => account.username === username && account.password === password
      );
    }

    setIsLoading(false);

    if (isValid) {
      setLoginError("");
      onRoleSelect(selectedRole);
    } else {
      if (selectedRole === 'manager') {
        setLoginError("Gmail hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.");
      } else {
        setLoginError("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.");
      }
    }
  };

  const handleResetPassword = () => {
    if (resetEmail) {
      // Giả lập gửi email reset
      setTimeout(() => {
        alert(`✅ Đã gửi liên kết đặt lại mật khẩu đến ${resetEmail}\n\nVui lòng kiểm tra hộp thư và làm theo hướng dẫn.`);
        setShowResetDialog(false);
        setResetEmail("");
      }, 1000);
    }
  };

  // Reset error khi thay đổi thông tin đăng nhập
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (loginError) setLoginError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (loginError) setLoginError("");
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
            <Coffee className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-gray-900">Coffee House</h1>
          <p className="text-gray-600 mt-2">Hệ thống quản lý quán cafe</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{getCurrentTime()}</span>
          </div>
        </div>

        {/* Role Selection */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Chọn vai trò của bạn</Label>
              <div className="grid gap-3 mt-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedRole === role.id
                          ? role.color + ' ring-2 ring-offset-2 ring-current'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6" />
                          <div>
                            <h3 className="font-medium">{role.title}</h3>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {role.loginMethod === 'Đăng nhập bằng Gmail' ? (
                            <Mail className="h-3 w-3 mr-1" />
                          ) : (
                            <Key className="h-3 w-3 mr-1" />
                          )}
                          {role.loginMethod === 'Đăng nhập bằng Gmail' ? 'Gmail' : 'Tài khoản'}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedRole && (
              <div className="space-y-4 pt-4 border-t">
                {selectedRole === 'manager' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                      <Shield className="h-4 w-4" />
                      <span>Quản lý đăng nhập bằng Gmail + Mật khẩu</span>
                    </div>
                    
                    <div>
                      <Label htmlFor="manager-email">Gmail</Label>
                      <Input
                        id="manager-email"
                        type="email"
                        placeholder="manager@coffeehouse.com"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Gmail đầu tiên đăng nhập sẽ trở thành quản lý mặc định
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="manager-password">Mật khẩu</Label>
                      <Input
                        id="manager-password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleLogin}
                      className="w-full"
                      disabled={!username || !password || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang xác thực...
                        </div>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Đăng nhập với Gmail
                        </>
                      )}
                    </Button>
                    
                    {/* Hiển thị lỗi đăng nhập */}
                    {loginError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{loginError}</p>
                      </div>
                    )}
                    
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Chỉ tài khoản Gmail được ủy quyền mới có thể truy cập chức năng quản lý
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Tên đăng nhập</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleLogin}
                      className="w-full"
                      disabled={!username || !password || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang xác thực...
                        </div>
                      ) : (
                        "Đăng nhập"
                      )}
                    </Button>
                    
                    {/* Hiển thị lỗi đăng nhập */}
                    {loginError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{loginError}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Quên mật khẩu cho tất cả vai trò */}
                <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedRole === 'manager' ? 'Quên mật khẩu Gmail?' : 'Quên mật khẩu?'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Lấy lại mật khẩu</DialogTitle>
                      <DialogDescription>
                        {selectedRole === 'manager' 
                          ? 'Nhập Gmail đã đăng ký để nhận hướng dẫn đặt lại mật khẩu'
                          : 'Liên hệ quản lý để được hỗ trợ đặt lại mật khẩu tài khoản'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {selectedRole === 'manager' ? (
                        <>
                          <div>
                            <Label htmlFor="reset-email">Gmail quản lý</Label>
                            <Input
                              id="reset-email"
                              type="email"
                              placeholder="manager@coffeehouse.com"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <Button 
                            onClick={handleResetPassword}
                            className="w-full"
                            disabled={!resetEmail}
                          >
                            Gửi hướng dẫn đặt lại
                          </Button>
                        </>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              Tài khoản {selectedRole === 'staff' ? 'nhân viên' : 'máy POS'} được quản lý bởi quản lý cửa hàng.
                            </p>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Để đặt lại mật khẩu, vui lòng:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Liên hệ trực tiếp với quản lý</li>
                              <li>Hoặc gọi hotline: 0123-456-789</li>
                            </ul>
                          </div>
                          <Button 
                            onClick={() => setShowResetDialog(false)}
                            className="w-full"
                          >
                            Đã hiểu
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                {(selectedRole === 'staff' || selectedRole === 'pos') && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Key className="h-4 w-4" />
                      Tài khoản được tạo và quản lý bởi quản lý cửa hàng
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Demo credentials */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            🔒 Tài khoản demo đã được bảo mật
          </h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700 font-medium">
              🚫 Hệ thống đã bật xác thực - chỉ nhập đúng thông tin mới đăng nhập được!
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Tài khoản Quản lý:
              </p>
              <div className="bg-white rounded-lg p-3 space-y-2 border">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Option 1:</span> Gmail: <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">manager@coffeehouse.com</span> | Mật khẩu: <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">123456</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Option 2:</span> Gmail: <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">admin@coffeehouse.com</span> | Mật khẩu: <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">admin123</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Key className="h-4 w-4 text-green-600" />
                Tài khoản Nhân viên & POS:
              </p>
              <div className="bg-white rounded-lg p-3 space-y-2 border">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Option 1:</span> Username: <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">demo</span> | Mật khẩu: <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">123456</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Option 2:</span> Username: <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">staff01</span> | Mật khẩu: <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">123456</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Option 3:</span> Username: <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">pos01</span> | Mật khẩu: <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">123456</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}