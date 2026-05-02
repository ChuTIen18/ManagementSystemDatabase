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
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'manager') {
        return <Navigate to="/manager" replace />;
    }

    if (user.role === 'pos') {
        return <Navigate to="/pos" replace />;
    }

    return <Navigate to="/staff" replace />;
};

const ProtectedRoute: React.FC<{
    children: React.ReactNode;
    requiredRoles?: string[];
}> = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unauthorized" element={<div>Unauthorized</div>} />

                    <Route
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<RoleHomeRedirect />} />
                        <Route
                            path="/manager"
                            element={
                                <ProtectedRoute requiredRoles={['manager']}>
                                    <ManagerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/pos"
                            element={
                                <ProtectedRoute requiredRoles={['pos', 'manager']}>
                                    <POSDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/staff"
                            element={
                                <ProtectedRoute requiredRoles={['staff', 'manager']}>
                                    <StaffDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <OrdersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/menu"
                            element={
                                <ProtectedRoute>
                                    <MenuPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/staff-management"
                            element={
                                <ProtectedRoute requiredRoles={['manager']}>
                                    <StaffManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/schedule-management"
                            element={
                                <ProtectedRoute>
                                    <ScheduleManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/attendance-management"
                            element={
                                <ProtectedRoute>
                                    <AttendanceManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/leave-management"
                            element={
                                <ProtectedRoute>
                                    <LeaveManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/inventory-management"
                            element={
                                <ProtectedRoute requiredRoles={['manager']}>
                                    <InventoryManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/equipment-management"
                            element={
                                <ProtectedRoute requiredRoles={['manager']}>
                                    <EquipmentManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/promotions-management"
                            element={
                                <ProtectedRoute requiredRoles={['manager']}>
                                    <PromotionsManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/table-management"
                            element={
                                <ProtectedRoute requiredRoles={['manager']}>
                                    <TableManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/customer-feedback"
                            element={
                                <ProtectedRoute>
                                    <CustomerFeedback />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/reports-analytics"
                            element={
                                <ProtectedRoute requiredRoles={['manager']}>
                                    <ReportsAnalytics />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <RoleHomeRedirect />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
