import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import ManagerDashboard from './pages/ManagerDashboard';
import POSDashboard from './pages/POSDashboard';
import StaffDashboard from './pages/StaffDashboard';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import StaffManagement from './pages/StaffManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import LeaveManagement from './pages/LeaveManagement';
import InventoryManagement from './pages/InventoryManagement';
import EquipmentManagement from './pages/EquipmentManagement';
import PromotionsManagement from './pages/PromotionsManagement';
import TableManagement from './pages/TableManagement';
import CustomerFeedback from './pages/CustomerFeedback';
import ReportsAnalytics from './pages/ReportsAnalytics';
const RoleHomeRedirect = () => {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (user.role === 'manager') {
        return _jsx(Navigate, { to: "/manager", replace: true });
    }
    if (user.role === 'pos') {
        return _jsx(Navigate, { to: "/pos", replace: true });
    }
    return _jsx(Navigate, { to: "/staff", replace: true });
};
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("div", { className: "text-xl", children: "Loading..." }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
function App() {
    return (_jsx(Router, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/unauthorized", element: _jsx("div", { children: "Unauthorized" }) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(RoleHomeRedirect, {}) }), _jsx(Route, { path: "/manager", element: _jsx(ProtectedRoute, { requiredRoles: ['manager'], children: _jsx(ManagerDashboard, {}) }) }), _jsx(Route, { path: "/pos", element: _jsx(ProtectedRoute, { requiredRoles: ['pos', 'manager'], children: _jsx(POSDashboard, {}) }) }), _jsx(Route, { path: "/staff", element: _jsx(ProtectedRoute, { requiredRoles: ['staff', 'manager'], children: _jsx(StaffDashboard, {}) }) }), _jsx(Route, { path: "/orders", element: _jsx(ProtectedRoute, { children: _jsx(OrdersPage, {}) }) }), _jsx(Route, { path: "/menu", element: _jsx(ProtectedRoute, { children: _jsx(MenuPage, {}) }) }), _jsx(Route, { path: "/staff-management", element: _jsx(ProtectedRoute, { requiredRoles: ['manager'], children: _jsx(StaffManagement, {}) }) }), _jsx(Route, { path: "/schedule-management", element: _jsx(ProtectedRoute, { children: _jsx(ScheduleManagement, {}) }) }), _jsx(Route, { path: "/attendance-management", element: _jsx(ProtectedRoute, { children: _jsx(AttendanceManagement, {}) }) }), _jsx(Route, { path: "/leave-management", element: _jsx(ProtectedRoute, { children: _jsx(LeaveManagement, {}) }) }), _jsx(Route, { path: "/inventory-management", element: _jsx(ProtectedRoute, { requiredRoles: ['manager'], children: _jsx(InventoryManagement, {}) }) }), _jsx(Route, { path: "/equipment-management", element: _jsx(ProtectedRoute, { requiredRoles: ['manager'], children: _jsx(EquipmentManagement, {}) }) }), _jsx(Route, { path: "/promotions-management", element: _jsx(ProtectedRoute, { requiredRoles: ['manager'], children: _jsx(PromotionsManagement, {}) }) }), _jsx(Route, { path: "/table-management", element: _jsx(ProtectedRoute, { requiredRoles: ['manager'], children: _jsx(TableManagement, {}) }) }), _jsx(Route, { path: "/customer-feedback", element: _jsx(ProtectedRoute, { children: _jsx(CustomerFeedback, {}) }) }), _jsx(Route, { path: "/reports-analytics", element: _jsx(ProtectedRoute, { requiredRoles: ['manager'], children: _jsx(ReportsAnalytics, {}) }) })] }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(RoleHomeRedirect, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
export default App;
