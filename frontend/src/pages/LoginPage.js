import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Coffee, Users, Monitor, Mail, Key, Shield, Clock } from 'lucide-react';
const LoginPage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const roles = [
        {
            id: 'staff',
            title: 'Nhân viên',
            description: 'Chấm công, xử lý hóa đơn, báo cáo',
            icon: Users,
            color: 'bg-blue-50 border-blue-200 text-blue-700',
            loginMethod: 'Tài khoản do quản lý tạo',
        },
        {
            id: 'pos',
            title: 'Máy POS',
            description: 'Gọi món, đánh giá, hoạt động cửa hàng',
            icon: Monitor,
            color: 'bg-green-50 border-green-200 text-green-700',
            loginMethod: 'Tài khoản do quản lý tạo',
        },
        {
            id: 'manager',
            title: 'Quản lý',
            description: 'Quản lý kho, nhân viên, nhà cung cấp, tài chính',
            icon: Coffee,
            color: 'bg-purple-50 border-purple-200 text-purple-700',
            loginMethod: 'Email + Mật khẩu',
        },
    ];
    const handleLogin = async (e) => {
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
        }
        catch (err) {
            setError(err.message || 'Đăng nhập thất bại');
        }
        finally {
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
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4", children: _jsx(Coffee, { className: "h-8 w-8 text-white" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "\u2615 Coffee House" }), _jsx("p", { className: "text-gray-600 mt-2", children: "H\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD qu\u00E1n cafe" }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-2 text-sm text-gray-500", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsx("span", { children: getCurrentTime() })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Ch\u1ECDn vai tr\u00F2 c\u1EE7a b\u1EA1n" }), _jsx("div", { className: "grid gap-3", children: roles.map((role) => {
                                        const Icon = role.icon;
                                        return (_jsx("button", { onClick: () => {
                                                setSelectedRole(role.id);
                                                setError('');
                                                setEmail('');
                                                setPassword('');
                                            }, className: `p-4 rounded-lg border-2 transition-all text-left ${selectedRole === role.id
                                                ? role.color + ' ring-2 ring-offset-2 ring-current border-current'
                                                : 'border-gray-200 hover:border-gray-300'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Icon, { className: "h-6 w-6 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: role.title }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: role.description })] })] }), _jsx("div", { className: "flex items-center gap-1 ml-2 px-2 py-1 bg-opacity-50 rounded text-xs font-medium", children: role.loginMethod === 'Email + Mật khẩu' ? (_jsxs(_Fragment, { children: [_jsx(Mail, { className: "h-3 w-3" }), "Email"] })) : (_jsxs(_Fragment, { children: [_jsx(Key, { className: "h-3 w-3" }), "T\u00E0i kho\u1EA3n"] })) })] }) }, role.id));
                                    }) })] }), selectedRole && (_jsxs("form", { onSubmit: handleLogin, className: "space-y-4 pt-4 border-t", children: [selectedRole === 'manager' ? (_jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-gray-600 mb-4 p-3 bg-purple-50 rounded-lg", children: [_jsx(Shield, { className: "h-4 w-4 text-purple-600" }), _jsx("span", { children: "Qu\u1EA3n l\u00FD \u0111\u0103ng nh\u1EADp b\u1EB1ng Email + M\u1EADt kh\u1EA9u" })] })) : null, _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: selectedRole === 'manager' ? 'Email' : 'Tên đăng nhập' }), _jsx("input", { type: selectedRole === 'manager' ? 'email' : 'text', placeholder: selectedRole === 'manager'
                                                ? 'manager@coffee.local'
                                                : 'Nhập tên đăng nhập', value: email, onChange: (e) => {
                                                setEmail(e.target.value);
                                                if (error)
                                                    setError('');
                                            }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent", disabled: isLoading }), selectedRole === 'manager' && (_jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Email \u0111\u1EA7u ti\u00EAn \u0111\u0103ng nh\u1EADp s\u1EBD tr\u1EDF th\u00E0nh qu\u1EA3n l\u00FD m\u1EB7c \u0111\u1ECBnh" }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "M\u1EADt kh\u1EA9u" }), _jsx("input", { type: "password", placeholder: "Nh\u1EADp m\u1EADt kh\u1EA9u", value: password, onChange: (e) => {
                                                setPassword(e.target.value);
                                                if (error)
                                                    setError('');
                                            }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent", disabled: isLoading })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded-lg", children: _jsx("p", { className: "text-sm text-red-700", children: error }) })), _jsx("button", { type: "submit", disabled: !email || !password || isLoading, className: "w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "\u0110ang x\u00E1c th\u1EF1c..."] })) : (_jsxs(_Fragment, { children: [_jsx(Mail, { className: "h-4 w-4" }), "\u0110\u0103ng nh\u1EADp"] })) }), (selectedRole === 'staff' || selectedRole === 'pos') && (_jsx("div", { className: "text-center p-3 bg-gray-50 rounded-lg", children: _jsxs("p", { className: "text-sm text-gray-600 flex items-center justify-center gap-2", children: [_jsx(Key, { className: "h-4 w-4" }), "T\u00E0i kho\u1EA3n \u0111\u01B0\u1EE3c t\u1EA1o v\u00E0 qu\u1EA3n l\u00FD b\u1EDFi qu\u1EA3n l\u00FD c\u1EEDa h\u00E0ng"] }) }))] }))] }), _jsx("div", { className: "bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-4 space-y-4", children: _jsxs("div", { children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-2 flex items-center gap-2", children: [_jsx(Shield, { className: "h-4 w-4 text-blue-600" }), "\uD83D\uDD12 T\u00E0i kho\u1EA3n demo"] }), _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3 mb-4", children: _jsx("p", { className: "text-sm text-red-700 font-medium", children: "\u26A0\uFE0F H\u1EC7 th\u1ED1ng b\u1EADt x\u00E1c th\u1EF1c - vui l\u00F2ng nh\u1EADp th\u00F4ng tin \u0111\u00FAng!" }) }), _jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "text-sm font-medium text-gray-700 mb-2 flex items-center gap-2", children: [_jsx(Mail, { className: "h-4 w-4 text-blue-600" }), "\uD83D\uDC54 T\u00E0i kho\u1EA3n Qu\u1EA3n l\u00FD:"] }), _jsxs("div", { className: "bg-white rounded-lg p-3 space-y-2 border border-blue-200", children: [_jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Email:" }), ' ', _jsx("code", { className: "bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono text-xs", children: "manager@coffee.local" })] }), _jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Password:" }), ' ', _jsx("code", { className: "bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono text-xs", children: "123456" })] }), _jsx("div", { className: "text-xs text-blue-600 mt-2", children: "\u2139\uFE0F C\u00F3 quy\u1EC1n: Qu\u1EA3n l\u00FD \u0111\u1EA7y \u0111\u1EE7 to\u00E0n b\u1ED9 h\u1EC7 th\u1ED1ng" })] })] }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium text-gray-700 mb-2 flex items-center gap-2", children: [_jsx(Key, { className: "h-4 w-4 text-green-600" }), "\uD83D\uDC65 T\u00E0i kho\u1EA3n Nh\u00E2n vi\u00EAn & POS:"] }), _jsxs("div", { className: "bg-white rounded-lg p-3 space-y-2 border border-green-200", children: [_jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Username:" }), ' ', _jsx("code", { className: "bg-green-100 px-2 py-1 rounded text-green-800 font-mono text-xs", children: "demo" })] }), _jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Password:" }), ' ', _jsx("code", { className: "bg-green-100 px-2 py-1 rounded text-green-800 font-mono text-xs", children: "123456" })] }), _jsx("div", { className: "text-xs text-green-600 mt-2", children: "\u2139\uFE0F S\u1EED d\u1EE5ng cho c\u1EA3 Staff v\u00E0 POS roles" })] })] })] }) })] }) }));
};
export default LoginPage;
