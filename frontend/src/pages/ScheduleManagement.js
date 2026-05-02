import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { schedulesAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Plus, CheckCircle, XCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
const ShiftTimes = {
    morning: '6:00 AM - 12:00 PM',
    lunch: '12:00 PM - 4:00 PM',
    afternoon: '4:00 PM - 8:00 PM',
    evening: '8:00 PM - 12:00 AM',
};
const ShiftColors = {
    morning: 'bg-yellow-100 border-yellow-300',
    lunch: 'bg-blue-100 border-blue-300',
    afternoon: 'bg-purple-100 border-purple-300',
    evening: 'bg-indigo-100 border-indigo-300',
};
const StatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};
const ScheduleManagement = () => {
    const { user } = useAuth();
    const isManager = user?.role === 'manager';
    const isStaff = user?.role === 'staff';
    const [schedules, setSchedules] = useState([]);
    const [users, setUsers] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShift, setSelectedShift] = useState('morning');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterUser, setFilterUser] = useState('');
    // Fetch schedules
    const fetchSchedules = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (filterDate)
                params.date = filterDate;
            if (filterStatus)
                params.status = filterStatus;
            if (filterUser && isManager)
                params.user_id = filterUser;
            const response = await schedulesAPI.getAll(params);
            setSchedules(response.data.data);
            // Fetch user info if manager
            if (isManager) {
                const userIds = [...new Set(response.data.data.map((s) => s.user_id))];
                const userMap = new Map();
                for (const userId of userIds) {
                    try {
                        const userRes = await usersAPI.getById(userId);
                        userMap.set(userId, userRes.data.data);
                    }
                    catch (err) {
                        console.error(`Failed to fetch user ${userId}`);
                    }
                }
                setUsers(userMap);
            }
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch schedules');
            console.error('Error fetching schedules:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSchedules();
    }, [filterDate, filterStatus, filterUser]);
    // Request new shift
    const handleRequestShift = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            if (!selectedDate || !selectedShift) {
                setError('Please select both date and shift');
                return;
            }
            await schedulesAPI.create({
                date: selectedDate,
                shift_type: selectedShift,
            });
            setSuccessMessage('Schedule request submitted successfully');
            setShowForm(false);
            setSelectedDate('');
            setSelectedShift('morning');
            await fetchSchedules();
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to request schedule');
            console.error('Error requesting schedule:', err);
        }
    };
    // Approve schedule (manager)
    const handleApprove = async (scheduleId) => {
        try {
            setError(null);
            await schedulesAPI.approve(scheduleId);
            setSuccessMessage('Schedule approved');
            await fetchSchedules();
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to approve schedule');
            console.error('Error approving schedule:', err);
        }
    };
    // Reject schedule (manager)
    const handleReject = async (scheduleId) => {
        try {
            setError(null);
            await schedulesAPI.reject(scheduleId);
            setSuccessMessage('Schedule rejected');
            await fetchSchedules();
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to reject schedule');
            console.error('Error rejecting schedule:', err);
        }
    };
    // Cancel schedule (staff - own pending only)
    const handleCancel = async (scheduleId) => {
        if (!window.confirm('Are you sure you want to cancel this schedule request?')) {
            return;
        }
        try {
            setError(null);
            await schedulesAPI.delete(scheduleId);
            setSuccessMessage('Schedule cancelled');
            await fetchSchedules();
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to cancel schedule');
            console.error('Error cancelling schedule:', err);
        }
    };
    // Get status badge
    const getStatusBadge = (status) => {
        const icons = {
            pending: _jsx(Clock, { size: 16 }),
            approved: _jsx(CheckCircle, { size: 16 }),
            rejected: _jsx(XCircle, { size: 16 }),
        };
        return (_jsxs("span", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${StatusColors[status]}`, children: [icons[status], status.charAt(0).toUpperCase() + status.slice(1)] }));
    };
    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];
    return (_jsx("div", { className: "p-8 bg-gray-50 min-h-screen", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: isManager ? 'Schedule Management' : 'My Schedule' }), isStaff && (_jsxs("button", { onClick: () => setShowForm(!showForm), className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition", children: [_jsx(Plus, { size: 20 }), "Request Shift"] }))] }), successMessage && (_jsx("div", { className: "mb-4 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700", children: successMessage })), error && (_jsxs("div", { className: "mb-4 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-2 text-red-700", children: [_jsx(AlertCircle, { size: 20 }), error] })), isStaff && showForm && (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Request New Shift" }), _jsxs("form", { onSubmit: handleRequestShift, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Date *" }), _jsx("input", { type: "date", value: selectedDate, onChange: e => setSelectedDate(e.target.value), min: today, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Shift *" }), _jsxs("select", { value: selectedShift, onChange: e => setSelectedShift(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "morning", children: "Morning (6:00 AM - 12:00 PM)" }), _jsx("option", { value: "lunch", children: "Lunch (12:00 PM - 4:00 PM)" }), _jsx("option", { value: "afternoon", children: "Afternoon (4:00 PM - 8:00 PM)" }), _jsx("option", { value: "evening", children: "Evening (8:00 PM - 12:00 AM)" })] })] })] }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx("button", { type: "submit", className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition", children: "Request Shift" }), _jsx("button", { type: "button", onClick: () => setShowForm(false), className: "bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition", children: "Cancel" })] })] })] })), _jsx("div", { className: "bg-white rounded-lg shadow-md p-4 mb-6", children: _jsxs("div", { className: "flex gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Date" }), _jsx("input", { type: "date", value: filterDate, onChange: e => setFilterDate(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { value: filterStatus, onChange: e => setFilterStatus(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "rejected", children: "Rejected" })] })] }), isManager && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Staff Member" }), _jsxs("select", { value: filterUser, onChange: e => setFilterUser(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Staff" }), Array.from(users.values()).map(u => (_jsx("option", { value: u.id, children: u.full_name }, u.id)))] })] }))] }) }), _jsx("div", { className: "space-y-4", children: loading ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: "Loading schedules..." })) : schedules.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: isStaff ? 'No schedules yet. Request a shift to get started!' : 'No schedules found' })) : (schedules.map(schedule => (_jsx("div", { className: `border-2 rounded-lg p-6 ${ShiftColors[schedule.shift_type]}`, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [isManager && (_jsxs("p", { className: "text-sm text-gray-600 mb-2", children: [_jsx("strong", { children: "Staff:" }), " ", users.get(schedule.user_id)?.full_name || `User #${schedule.user_id}`] })), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Date" }), _jsx("p", { className: "text-xl font-bold", children: new Date(schedule.date).toLocaleDateString() })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Shift" }), _jsx("p", { className: "text-lg font-semibold", children: schedule.shift_type.charAt(0).toUpperCase() + schedule.shift_type.slice(1) }), _jsx("p", { className: "text-xs text-gray-600", children: ShiftTimes[schedule.shift_type] })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "mb-4", children: getStatusBadge(schedule.status) }), isManager && schedule.status === 'pending' && (_jsxs("div", { className: "flex gap-2 justify-end", children: [_jsxs("button", { onClick: () => handleApprove(schedule.id), className: "flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition text-sm", children: [_jsx(CheckCircle, { size: 16 }), "Approve"] }), _jsxs("button", { onClick: () => handleReject(schedule.id), className: "flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm", children: [_jsx(XCircle, { size: 16 }), "Reject"] })] })), isStaff && schedule.status === 'pending' && (_jsxs("button", { onClick: () => handleCancel(schedule.id), className: "flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm", children: [_jsx(Trash2, { size: 16 }), "Cancel"] }))] })] }) }, schedule.id)))) })] }) }));
};
export default ScheduleManagement;
