import React, { useState, useEffect } from 'react';
import { schedulesAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Plus, CheckCircle, XCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface Schedule {
    id: number;
    user_id: number;
    date: string;
    shift_type: 'morning' | 'lunch' | 'afternoon' | 'evening';
    status: 'pending' | 'approved' | 'rejected';
    created_at?: string;
}

interface User {
    id: number;
    full_name: string;
    email: string;
}

const ShiftTimes: Record<string, string> = {
    morning: '6:00 AM - 12:00 PM',
    lunch: '12:00 PM - 4:00 PM',
    afternoon: '4:00 PM - 8:00 PM',
    evening: '8:00 PM - 12:00 AM',
};

const ShiftColors: Record<string, string> = {
    morning: 'bg-yellow-100 border-yellow-300',
    lunch: 'bg-blue-100 border-blue-300',
    afternoon: 'bg-purple-100 border-purple-300',
    evening: 'bg-indigo-100 border-indigo-300',
};

const StatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const ScheduleManagement = () => {
    const { user } = useAuth();
    const isManager = user?.role === 'manager';
    const isStaff = user?.role === 'staff';

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [users, setUsers] = useState<Map<number, User>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShift, setSelectedShift] = useState<'morning' | 'lunch' | 'afternoon' | 'evening'>('morning');
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterUser, setFilterUser] = useState('');

    // Fetch schedules
    const fetchSchedules = async () => {
        try {
            setLoading(true);
            setError(null);

            const params: any = {};
            if (filterDate) params.date = filterDate;
            if (filterStatus) params.status = filterStatus;
            if (filterUser && isManager) params.user_id = filterUser;

            const response = await schedulesAPI.getAll(params);
            setSchedules(response.data.data);

            // Fetch user info if manager
            if (isManager) {
                const userIds: number[] = [...new Set((response.data.data as Schedule[]).map((s) => s.user_id))];
                const userMap = new Map<number, User>();

                for (const userId of userIds) {
                    try {
                        const userRes = await usersAPI.getById(userId);
                        userMap.set(userId, userRes.data.data as User);
                    } catch (err) {
                        console.error(`Failed to fetch user ${userId}`);
                    }
                }

                setUsers(userMap);
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to fetch schedules');
            console.error('Error fetching schedules:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [filterDate, filterStatus, filterUser]);

    // Request new shift
    const handleRequestShift = async (e: React.FormEvent) => {
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
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to request schedule');
            console.error('Error requesting schedule:', err);
        }
    };

    // Approve schedule (manager)
    const handleApprove = async (scheduleId: number) => {
        try {
            setError(null);
            await schedulesAPI.approve(scheduleId);
            setSuccessMessage('Schedule approved');
            await fetchSchedules();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to approve schedule');
            console.error('Error approving schedule:', err);
        }
    };

    // Reject schedule (manager)
    const handleReject = async (scheduleId: number) => {
        try {
            setError(null);
            await schedulesAPI.reject(scheduleId);
            setSuccessMessage('Schedule rejected');
            await fetchSchedules();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to reject schedule');
            console.error('Error rejecting schedule:', err);
        }
    };

    // Cancel schedule (staff - own pending only)
    const handleCancel = async (scheduleId: number) => {
        if (!window.confirm('Are you sure you want to cancel this schedule request?')) {
            return;
        }

        try {
            setError(null);
            await schedulesAPI.delete(scheduleId);
            setSuccessMessage('Schedule cancelled');
            await fetchSchedules();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to cancel schedule');
            console.error('Error cancelling schedule:', err);
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const icons: Record<string, React.ReactNode> = {
            pending: <Clock size={16} />,
            approved: <CheckCircle size={16} />,
            rejected: <XCircle size={16} />,
        };

        return (
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${StatusColors[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isManager ? 'Schedule Management' : 'My Schedule'}
                    </h1>
                    {isStaff && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={20} />
                            Request Shift
                        </button>
                    )}
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {/* Request Shift Form (Staff Only) */}
                {isStaff && showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Request New Shift</h2>

                        <form onSubmit={handleRequestShift} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                        min={today}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Shift Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Shift *
                                    </label>
                                    <select
                                        value={selectedShift}
                                        onChange={e => setSelectedShift(e.target.value as any)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="morning">Morning (6:00 AM - 12:00 PM)</option>
                                        <option value="lunch">Lunch (12:00 PM - 4:00 PM)</option>
                                        <option value="afternoon">Afternoon (4:00 PM - 8:00 PM)</option>
                                        <option value="evening">Evening (8:00 PM - 12:00 AM)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Request Shift
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex gap-4 flex-wrap">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={e => setFilterDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        {isManager && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Staff Member
                                </label>
                                <select
                                    value={filterUser}
                                    onChange={e => setFilterUser(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Staff</option>
                                    {Array.from(users.values()).map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Schedules List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading schedules...</div>
                    ) : schedules.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {isStaff ? 'No schedules yet. Request a shift to get started!' : 'No schedules found'}
                        </div>
                    ) : (
                        schedules.map(schedule => (
                            <div
                                key={schedule.id}
                                className={`border-2 rounded-lg p-6 ${ShiftColors[schedule.shift_type]}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {isManager && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                <strong>Staff:</strong> {users.get(schedule.user_id)?.full_name || `User #${schedule.user_id}`}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Date</p>
                                                <p className="text-xl font-bold">
                                                    {new Date(schedule.date).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-600">Shift</p>
                                                <p className="text-lg font-semibold">
                                                    {schedule.shift_type.charAt(0).toUpperCase() + schedule.shift_type.slice(1)}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {ShiftTimes[schedule.shift_type]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="mb-4">
                                            {getStatusBadge(schedule.status)}
                                        </div>

                                        {/* Manager Actions */}
                                        {isManager && schedule.status === 'pending' && (
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleApprove(schedule.id)}
                                                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition text-sm"
                                                >
                                                    <CheckCircle size={16} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(schedule.id)}
                                                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {/* Staff Actions */}
                                        {isStaff && schedule.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(schedule.id)}
                                                className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
                                            >
                                                <Trash2 size={16} />
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagement;
