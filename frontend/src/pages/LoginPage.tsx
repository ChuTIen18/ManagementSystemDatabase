import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Coffee, Users, Monitor, Mail, Key, Shield, Clock } from 'lucide-react';

const LoginPage = () => {
    const [selectedRole, setSelectedRole] = useState<'staff' | 'pos' | 'manager' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const roles = [
        {
            id: 'staff' as const,
            title: 'Nhân viên',
            description: 'Chấm công, xử lý hóa đơn, báo cáo',
            icon: Users,
            color: 'bg-blue-50 border-blue-200 text-blue-700',
            loginMethod: 'Tài khoản do quản lý tạo',
        },
        {
            id: 'pos' as const,
            title: 'Máy POS',
            description: 'Gọi món, đánh giá, hoạt động cửa hàng',
            icon: Monitor,
            color: 'bg-green-50 border-green-200 text-green-700',
            loginMethod: 'Tài khoản do quản lý tạo',
        },
        {
            id: 'manager' as const,
            title: 'Quản lý',
            description: 'Quản lý kho, nhân viên, nhà cung cấp, tài chính',
            icon: Coffee,
            color: 'bg-purple-50 border-purple-200 text-purple-700',
            loginMethod: 'Email + Mật khẩu',
        },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole || !email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
            // Navigate based on role
            switch (selectedRole) {
                case 'manager':
                    navigate('/manager');
                    break;
                case 'pos':
                    navigate('/pos');
                    break;
                case 'staff':
                    navigate('/staff');
                    break;
            }
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentTime = () => {
        return new Date().toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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
                    <h1 className="text-3xl font-bold text-gray-900">☕ Coffee House</h1>
                    <p className="text-gray-600 mt-2">Hệ thống quản lý quán cafe</p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{getCurrentTime()}</span>
                    </div>
                </div>

                {/* Role Selection Card */}
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Chọn vai trò của bạn
                        </label>
                        <div className="grid gap-3">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => {
                                            setSelectedRole(role.id);
                                            setError('');
                                            setEmail('');
                                            setPassword('');
                                        }}
                                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                                            selectedRole === role.id
                                                ? role.color + ' ring-2 ring-offset-2 ring-current border-current'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-6 w-6 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {role.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {role.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-opacity-50 rounded text-xs font-medium">
                                                {role.loginMethod === 'Email + Mật khẩu' ? (
                                                    <>
                                                        <Mail className="h-3 w-3" />
                                                        Email
                                                    </>
                                                ) : (
                                                    <>
                                                        <Key className="h-3 w-3" />
                                                        Tài khoản
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedRole && (
                        <form onSubmit={handleLogin} className="space-y-4 pt-4 border-t">
                            {selectedRole === 'manager' ? (
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4 p-3 bg-purple-50 rounded-lg">
                                    <Shield className="h-4 w-4 text-purple-600" />
                                    <span>Quản lý đăng nhập bằng Email + Mật khẩu</span>
                                </div>
                            ) : null}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {selectedRole === 'manager' ? 'Email' : 'Tên đăng nhập'}
                                </label>
                                <input
                                    type={selectedRole === 'manager' ? 'email' : 'text'}
                                    placeholder={
                                        selectedRole === 'manager'
                                            ? 'manager@coffee.local'
                                            : 'Nhập tên đăng nhập'
                                    }
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                                {selectedRole === 'manager' && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Email đầu tiên đăng nhập sẽ trở thành quản lý mặc định
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!email || !password || isLoading}
                                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang xác thực...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4" />
                                        Đăng nhập
                                    </>
                                )}
                            </button>

                            {(selectedRole === 'staff' || selectedRole === 'pos') && (
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                                        <Key className="h-4 w-4" />
                                        Tài khoản được tạo và quản lý bởi quản lý cửa hàng
                                    </p>
                                </div>
                            )}
                        </form>
                    )}
                </div>

                {/* Demo Credentials Card */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            🔒 Tài khoản demo
                        </h4>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-700 font-medium">
                                ⚠️ Hệ thống bật xác thực - vui lòng nhập thông tin đúng!
                            </p>
                        </div>

                        {/* Manager Credentials */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-600" />
                                👔 Tài khoản Quản lý:
                            </p>
                            <div className="bg-white rounded-lg p-3 space-y-2 border border-blue-200">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Email:</span>{' '}
                                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono text-xs">
                                        manager@coffee.local
                                    </code>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Password:</span>{' '}
                                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono text-xs">
                                        123456
                                    </code>
                                </div>
                                <div className="text-xs text-blue-600 mt-2">
                                    ℹ️ Có quyền: Quản lý đầy đủ toàn bộ hệ thống
                                </div>
                            </div>
                        </div>

                        {/* Staff & POS Credentials */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Key className="h-4 w-4 text-green-600" />
                                👥 Tài khoản Nhân viên & POS:
                            </p>
                            <div className="bg-white rounded-lg p-3 space-y-2 border border-green-200">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Username:</span>{' '}
                                    <code className="bg-green-100 px-2 py-1 rounded text-green-800 font-mono text-xs">
                                        demo
                                    </code>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Password:</span>{' '}
                                    <code className="bg-green-100 px-2 py-1 rounded text-green-800 font-mono text-xs">
                                        123456
                                    </code>
                                </div>
                                <div className="text-xs text-green-600 mt-2">
                                    ℹ️ Sử dụng cho cả Staff và POS roles
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
