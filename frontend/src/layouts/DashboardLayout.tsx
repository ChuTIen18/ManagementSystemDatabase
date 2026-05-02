import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Coffee,
    LayoutDashboard,
    ClipboardList,
    UtensilsCrossed,
    Users,
    CalendarDays,
    CheckCheck,
    BadgeDollarSign,
    Boxes,
    Wrench,
    Percent,
    TableProperties,
    MessageSquareText,
    BarChart2,
    LogOut,
} from 'lucide-react';

type NavItem = {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: Array<'staff' | 'pos' | 'manager'>;
};

const DashboardLayout = () => {
    const { user, logout } = useAuth();

    const navItems: NavItem[] = [
        { to: '/manager', label: 'Dashboard Manager', icon: LayoutDashboard, roles: ['manager'] },
        { to: '/pos', label: 'Dashboard POS', icon: LayoutDashboard, roles: ['pos', 'manager'] },
        { to: '/staff', label: 'Dashboard Staff', icon: LayoutDashboard, roles: ['staff', 'manager'] },
        { to: '/orders', label: 'Orders', icon: ClipboardList },
        { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
        {
            to: '/staff-management',
            label: 'Staff Management',
            icon: Users,
            roles: ['manager'],
        },
        { to: '/schedule-management', label: 'Schedules', icon: CalendarDays },
        { to: '/attendance-management', label: 'Attendance', icon: CheckCheck },
        { to: '/leave-management', label: 'Leave Requests', icon: BadgeDollarSign },
        { to: '/inventory-management', label: 'Inventory', icon: Boxes, roles: ['manager'] },
        { to: '/equipment-management', label: 'Equipment', icon: Wrench, roles: ['manager'] },
        {
            to: '/promotions-management',
            label: 'Promotions',
            icon: Percent,
            roles: ['manager'],
        },
        { to: '/table-management', label: 'Tables', icon: TableProperties, roles: ['manager'] },
        { to: '/customer-feedback', label: 'Feedback', icon: MessageSquareText },
        { to: '/reports-analytics', label: 'Reports', icon: BarChart2, roles: ['manager'] },
    ];

    const visibleItems = navItems.filter((item) => {
        if (!item.roles || !user?.role) {
            return true;
        }
        return item.roles.includes(user.role);
    });

    return (
        <div className="min-h-screen bg-slate-100 md:grid md:grid-cols-[280px_1fr]">
            <aside className="bg-gradient-to-b from-amber-700 via-amber-800 to-zinc-900 p-4 text-white md:h-screen md:sticky md:top-0 md:overflow-y-auto">
                <div className="mb-5 rounded-xl border border-amber-500/50 bg-amber-600/20 p-4">
                    <div className="flex items-center gap-2">
                        <Coffee className="h-5 w-5 text-amber-200" />
                        <h2 className="text-lg font-semibold tracking-wide">Coffee House</h2>
                    </div>
                    <p className="mt-1 text-xs text-amber-100/85">Management Control Center</p>
                </div>

                <nav className="grid gap-1">
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                                        isActive
                                            ? 'bg-amber-200 text-amber-950'
                                            : 'text-amber-50 hover:bg-white/10'
                                    }`
                                }
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-5 rounded-xl border border-amber-500/40 bg-zinc-900/40 p-3">
                    <p className="text-sm font-semibold">{user?.full_name}</p>
                    <p className="text-xs uppercase tracking-wide text-amber-200">{user?.role}</p>
                    <button
                        onClick={logout}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium transition hover:bg-red-700"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            <div className="min-h-screen">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
                    <h1 className="text-lg font-semibold text-slate-800">Operations Dashboard</h1>
                    <p className="text-xs text-slate-500">Theo doi van hanh, don hang va hieu suat cua quan</p>
                </header>

                <main className="min-h-[calc(100vh-65px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
