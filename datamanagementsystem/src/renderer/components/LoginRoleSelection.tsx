import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Coffee,
  Users,
  Monitor,
  Clock,
  Mail,
  Key,
  Shield,
  CheckCircle2,
} from "lucide-react";

interface LoginRoleSelectionProps {
  onRoleSelect: (role: "staff" | "pos" | "manager") => void;
}

export function LoginRoleSelection({ onRoleSelect }: LoginRoleSelectionProps) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<
    "staff" | "pos" | "manager" | null
  >(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Clear error message when role changes
  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => {
        setLoginError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  const roles = [
    {
      id: "staff" as const,
      title: "Nhân viên",
      description: "Chấm công, xử lý hóa đơn, báo cáo",
      icon: Users,
    },
    {
      id: "pos" as const,
      title: "Máy POS",
      description: "Gọi món, đánh giá, hoạt động cửa hàng",
      icon: Monitor,
    },
    {
      id: "manager" as const,
      title: "Quản lý",
      description: "Quản lý kho, nhân viên, nhà cung cấp, tài chính",
      icon: Coffee,
    },
  ];

  const validAccounts = {
    manager: [
      { email: "manager@coffeehouse.com", password: "123456" },
      { email: "admin@coffeehouse.com", password: "admin123" },
    ],
    staff: [
      { username: "demo", password: "123456" },
      { username: "staff01", password: "123456" },
      { username: "nhanvien", password: "123456" },
    ],
    pos: [
      { username: "demo", password: "123456" },
      { username: "pos01", password: "123456" },
      { username: "maypos", password: "123456" },
    ],
  };

  const handleLogin = async () => {
    if (!selectedRole || !username || !password) {
      setLoginError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    let isValid = false;

    if (selectedRole === "manager") {
      isValid = validAccounts.manager.some(
        (account) =>
          account.email === username && account.password === password,
      );
    } else {
      const accounts = validAccounts[selectedRole];
      isValid = accounts.some(
        (account) =>
          account.username === username && account.password === password,
      );
    }

    setIsLoading(false);

    if (isValid) {
      setLoginError("");
      // Show success notification before redirecting
      const roleLabel =
        selectedRole === "manager"
          ? "Quản lý"
          : selectedRole === "staff"
            ? "Nhân viên"
            : "POS";
      setSuccessMessage(`Đăng nhập thành công với tài khoản ${roleLabel}!`);
      setLoginSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        onRoleSelect(selectedRole);
      }, 1500);
    } else {
      setLoginError(
        selectedRole === "manager"
          ? "Gmail hoặc mật khẩu không đúng. Vui lòng kiểm tra lại."
          : "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
      );
    }
  };

  const handleResetPassword = () => {
    if (resetEmail) {
      setTimeout(() => {
        alert(
          `✅ Đã gửi liên kết đặt lại mật khẩu đến ${resetEmail}\n\nVui lòng kiểm tra hộp thư và làm theo hướng dẫn.`,
        );
        setShowResetDialog(false);
        setResetEmail("");
      }, 1000);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (loginError) setLoginError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (loginError) setLoginError("");
  };

  const handleRoleChange = (role: "staff" | "pos" | "manager") => {
    setSelectedRole(role);
    setUsername("");
    setPassword("");
    setLoginError("");
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6 py-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <Coffee className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Coffee House</h1>
          <p className="text-sm text-gray-600">Hệ thống quản lý quán cà phê</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Clock className="h-4 w-4" />
            <span>{getCurrentTime()}</span>
          </div>
        </div>

        {/* Role Selection Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Chọn vai trò của bạn
          </h2>

          {/* Role buttons */}
          <div className="flex flex-col gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleChange(role.id)}
                  className={`p-4 rounded-lg border text-left flex items-center justify-between gap-3 transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-gray-900">
                        {role.title}
                      </span>
                      <span className="text-xs text-gray-600">
                        {role.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 border border-gray-200 rounded-md px-2 py-1">
                    <Key className="h-3 w-3 text-gray-700" />
                    <span className="text-xs font-medium text-gray-700">
                      Tài khoản
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Login form — shown after role is selected */}
          {selectedRole && (
            <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 mt-2">
              {/* Manager: Gmail login */}
              {selectedRole === "manager" ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Quản lý đăng nhập bằng Gmail + Mật khẩu</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Gmail
                    </label>
                    <input
                      type="email"
                      placeholder="manager@coffeehouse.com"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      autoComplete="username"
                      className="h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-0.5">
                      Gmail đầu tiên đăng nhập sẽ trở thành quản lý mặc định
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      autoComplete="current-password"
                      className="h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                /* Staff / POS: username + password */
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      autoComplete="username"
                      className="h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      autoComplete="current-password"
                      className="h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Login error */}
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-600 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              )}

              {/* Login success notification */}
              {loginSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-pulse">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Login button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={!username || !password || isLoading}
                className="h-10 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xác thực...
                  </>
                ) : selectedRole === "manager" ? (
                  <>
                    <Mail className="h-4 w-4" />
                    Đăng nhập với Gmail
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>

              {/* Navigate to register */}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors text-center"
              >
                Chưa có tài khoản?{" "}
                <span className="font-medium text-blue-600 hover:underline">
                  Đăng ký ngay
                </span>
              </button>

              {/* Forgot password dialog */}
              <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors text-center flex items-center justify-center gap-1.5 mt-1"
                  >
                    <Mail className="h-4 w-4" />
                    {selectedRole === "manager"
                      ? "Quên mật khẩu Gmail?"
                      : "Quên mật khẩu?"}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg">
                      Lấy lại mật khẩu
                    </DialogTitle>
                    <DialogDescription>
                      {selectedRole === "manager"
                        ? "Nhập Gmail đã đăng ký để nhận hướng dẫn đặt lại mật khẩu"
                        : "Liên hệ quản lý để được hỗ trợ đặt lại mật khẩu tài khoản"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    {selectedRole === "manager" ? (
                      <>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">
                            Gmail quản lý
                          </label>
                          <input
                            type="email"
                            placeholder="manager@coffeehouse.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleResetPassword}
                          disabled={!resetEmail}
                          className="h-10 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Gửi hướng dẫn đặt lại
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg w-full">
                          <p className="text-sm text-blue-700">
                            Tài khoản{" "}
                            {selectedRole === "staff" ? "nhân viên" : "máy POS"}{" "}
                            được quản lý bởi quản lý cửa hàng.
                          </p>
                        </div>
                        <div className="text-sm text-gray-600 w-full">
                          <p>Để đặt lại mật khẩu, vui lòng:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Liên hệ trực tiếp với quản lý</li>
                            <li>Hoặc gọi hotline: 0123-456-789</li>
                          </ul>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowResetDialog(false)}
                          className="h-10 w-full rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Đã hiểu
                        </button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {(selectedRole === "staff" || selectedRole === "pos") && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                    <Key className="h-4 w-4" />
                    Tài khoản được tạo và quản lý bởi quản lý cửa hàng
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Demo credentials card */}
        <div className="rounded-xl border border-blue-200 p-5 bg-linear-to-r from-blue-50 to-emerald-50">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">
              🔒 Tài khoản demo đã được bảo mật
            </span>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-red-700">
              🚫 Hệ thống đã bật xác thực - chỉ nhập đúng thông tin mới đăng
              nhập được!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Manager accounts */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Tài khoản Quản lý:
                </span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
                <p className="text-xs text-gray-600">
                  Option 1: Gmail:
                  <code className="text-blue-600 text-xs ml-1 font-mono">
                    manager@coffeehouse.com
                  </code>{" "}
                  | Mật khẩu:
                  <code className="text-blue-600 text-xs ml-1 font-mono">
                    123456
                  </code>
                </p>
                <p className="text-xs text-gray-600">
                  Option 2: Gmail:
                  <code className="text-blue-600 text-xs ml-1 font-mono">
                    admin@coffeehouse.com
                  </code>{" "}
                  | Mật khẩu:
                  <code className="text-blue-600 text-xs ml-1 font-mono">
                    admin123
                  </code>
                </p>
              </div>
            </div>

            {/* Staff & POS accounts */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Tài khoản Nhân viên & POS:
                </span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
                <p className="text-xs text-gray-600">
                  Option 1: Username:
                  <code className="text-green-600 text-xs ml-1 font-mono">
                    demo
                  </code>{" "}
                  | Mật khẩu:
                  <code className="text-green-600 text-xs ml-1 font-mono">
                    123456
                  </code>
                </p>
                <p className="text-xs text-gray-600">
                  Option 2: Username:
                  <code className="text-green-600 text-xs ml-1 font-mono">
                    staff01
                  </code>{" "}
                  | Mật khẩu:
                  <code className="text-green-600 text-xs ml-1 font-mono">
                    123456
                  </code>
                </p>
                <p className="text-xs text-gray-600">
                  Option 3: Username:
                  <code className="text-green-600 text-xs ml-1 font-mono">
                    pos01
                  </code>{" "}
                  | Mật khẩu:
                  <code className="text-green-600 text-xs ml-1 font-mono">
                    123456
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
