import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { attendanceAPI, usersAPI, schedulesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, AlertCircle, CheckCircle, Clock, Filter, Calendar, } from 'lucide-react';
export default function AttendanceManagement() {
    const { user } = useAuth();
    const isManager = user?.role === 'manager';
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [allAttendance, setAllAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [users, setUsers] = useState(new Map());
    // Filters for manager
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedUserId, setSelectedUserId] = useState();
    const [usersList, setUsersList] = useState([]);
    const shiftTimes = {
        morning: { start: '6:00 AM', end: '12:00 PM' },
        lunch: { start: '12:00 PM', end: '4:00 PM' },
        afternoon: { start: '4:00 PM', end: '8:00 PM' },
        evening: { start: '8:00 PM', end: '12:00 AM' },
    };
    // Fetch today's attendance for staff
    const fetchTodayAttendance = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await attendanceAPI.getAll({ date: today });
            if (response.data.data && response.data.data.length > 0) {
                setTodayAttendance(response.data.data[0]);
            }
            else {
                setTodayAttendance(null);
            }
        }
        catch (err) {
            console.error('Error fetching today attendance:', err);
        }
    };
    // Fetch all attendance for manager
    const fetchAllAttendance = async () => {
        try {
            setLoading(true);
            const params = {
                date: startDate === endDate ? startDate : undefined,
            };
            if (startDate !== endDate) {
                // For date range, we need to fetch each day separately or use month/year filters
                const start = new Date(startDate);
                const end = new Date(endDate);
                const year = start.getFullYear();
                const month = start.getMonth() + 1;
                params.month = month;
                params.year = year;
            }
            if (selectedUserId) {
                params.user_id = selectedUserId;
            }
            const response = await attendanceAPI.getAll(params);
            const attendance = response.data.data || [];
            // Enrich with user names
            const enriched = attendance.map((a) => ({
                ...a,
                user_name: users.get(a.user_id)?.full_name || 'Unknown',
            }));
            setAllAttendance(enriched);
            setError('');
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load attendance');
        }
        finally {
            setLoading(false);
        }
    };
    // Fetch all users (for manager filter)
    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll({ is_active: true });
            const userList = response.data.data || [];
            setUsersList(userList);
            // Create map for quick lookup
            const userMap = new Map();
            userList.forEach((u) => {
                userMap.set(u.id, u);
            });
            setUsers(userMap);
        }
        catch (err) {
            console.error('Error fetching users:', err);
        }
    };
    // Check-in handler
    const handleCheckIn = async () => {
        try {
            setLoading(true);
            setError('');
            // Check if has approved schedule today
            const today = new Date().toISOString().split('T')[0];
            const scheduleResponse = await schedulesAPI.getAll({
                date: today,
                status: 'approved',
            });
            const schedules = scheduleResponse.data.data || [];
            if (schedules.length === 0) {
                setError('No approved schedule found for today');
                setLoading(false);
                return;
            }
            await attendanceAPI.checkIn({
                fingerprint_data: null,
            });
            setSuccessMessage('✓ Checked in successfully');
            fetchTodayAttendance();
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to check in');
        }
        finally {
            setLoading(false);
        }
    };
    // Check-out handler
    const handleCheckOut = async () => {
        try {
            setLoading(true);
            setError('');
            if (!todayAttendance) {
                setError('No check-in found for today');
                setLoading(false);
                return;
            }
            await attendanceAPI.checkOut(todayAttendance.id);
            setSuccessMessage('✓ Checked out successfully');
            fetchTodayAttendance();
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to check out');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTodayAttendance();
        if (isManager) {
            fetchUsers();
        }
    }, []);
    useEffect(() => {
        if (isManager) {
            fetchAllAttendance();
        }
    }, [startDate, endDate, selectedUserId, users.size]);
    // Staff View
    if (!isManager) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Attendance" }), _jsx("p", { className: "text-gray-600", children: "Check-in and check-out for today" })] }), error && (_jsxs("div", { className: "mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "text-red-800", children: error })] })), successMessage && (_jsxs("div", { className: "mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "text-green-800", children: successMessage })] })), todayAttendance ? (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Today's Status" }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-600", children: "Check-in" }), _jsxs("div", { className: "flex items-center gap-3 mt-2", children: [_jsx(LogIn, { className: "w-5 h-5 text-green-600" }), _jsx("span", { className: "text-gray-900", children: new Date(todayAttendance.check_in).toLocaleTimeString() }), todayAttendance.is_late && (_jsx("span", { className: "text-xs bg-red-100 text-red-800 px-2 py-1 rounded", children: "LATE" }))] })] }), todayAttendance.check_out ? (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-600", children: "Check-out" }), _jsxs("div", { className: "flex items-center gap-3 mt-2", children: [_jsx(LogOut, { className: "w-5 h-5 text-blue-600" }), _jsx("span", { className: "text-gray-900", children: new Date(todayAttendance.check_out).toLocaleTimeString() })] })] })) : (_jsxs("button", { onClick: handleCheckOut, disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400", children: [_jsx(LogOut, { className: "w-4 h-4 inline mr-2" }), loading ? 'Checking out...' : 'Check Out'] }))] })] })) : (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Not Checked In" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Click the button below to check in for today. Make sure you have an approved schedule." }), _jsxs("button", { onClick: handleCheckIn, disabled: loading, className: "w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:bg-gray-400 text-lg", children: [_jsx(LogIn, { className: "w-5 h-5 inline mr-2" }), loading ? 'Checking in...' : 'Check In'] })] }))] }) }));
    }
    // Manager View
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Attendance Management" }), _jsx("p", { className: "text-gray-600", children: "Monitor staff attendance and late arrivals" })] }), error && (_jsxs("div", { className: "mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "text-red-800", children: error })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Filter, { className: "w-5 h-5" }), "Filters"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Start Date" }), _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "End Date" }), _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Staff Member" }), _jsxs("select", { value: selectedUserId || '', onChange: (e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : undefined), className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Staff" }), usersList.map((u) => (_jsx("option", { value: u.id, children: u.full_name }, u.id)))] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5" }), "Attendance Records ", loading && _jsx("span", { className: "text-sm text-gray-500", children: "Loading..." })] }), allAttendance.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Clock, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "No attendance records found" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Staff Name" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Date" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Check-in" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Check-out" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Duration" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: allAttendance.map((record) => {
                                            const checkInTime = new Date(record.check_in);
                                            const checkOutTime = record.check_out ? new Date(record.check_out) : null;
                                            const duration = checkOutTime
                                                ? Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60))
                                                : null;
                                            return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 text-sm text-gray-900", children: record.user_name }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: checkInTime.toLocaleDateString() }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-900", children: checkInTime.toLocaleTimeString() }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: checkOutTime ? checkOutTime.toLocaleTimeString() : '-' }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: duration ? `${duration} min` : '-' }), _jsx("td", { className: "px-4 py-3 text-sm", children: record.is_late ? (_jsxs("span", { className: "inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold", children: [_jsx(AlertCircle, { className: "w-3 h-3" }), "LATE"] })) : (_jsxs("span", { className: "inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold", children: [_jsx(CheckCircle, { className: "w-3 h-3" }), "ON TIME"] })) })] }, record.id));
                                        }) })] }) }))] })] }) }));
}
