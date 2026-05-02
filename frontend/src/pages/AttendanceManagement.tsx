import { useEffect, useState } from 'react';
import { attendanceAPI, usersAPI, schedulesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
    LogIn,
    LogOut,
    AlertCircle,
    CheckCircle,
    Clock,
    Filter,
    Calendar,
} from 'lucide-react';

interface Attendance {
    id: number;
    user_id: number;
    schedule_id: number;
    check_in: string;
    check_out?: string;
    is_late: boolean;
    notes?: string;
}

interface Schedule {
    id: number;
    user_id: number;
    date: string;
    shift_type: string;
    status: string;
}

interface User {
    id: number;
    full_name: string;
    email: string;
}

interface AttendanceWithUser extends Attendance {
    user_name?: string;
}

export default function AttendanceManagement() {
    const { user } = useAuth();
    const isManager = user?.role === 'manager';

    const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
    const [allAttendance, setAllAttendance] = useState<AttendanceWithUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [users, setUsers] = useState<Map<number, User>>(new Map());

    // Filters for manager
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
    const [usersList, setUsersList] = useState<User[]>([]);

    const shiftTimes: Record<string, { start: string; end: string }> = {
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
            } else {
                setTodayAttendance(null);
            }
        } catch (err: any) {
            console.error('Error fetching today attendance:', err);
        }
    };

    // Fetch all attendance for manager
    const fetchAllAttendance = async () => {
        try {
            setLoading(true);
            const params: any = {
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
            const enriched = attendance.map((a: Attendance) => ({
                ...a,
                user_name: users.get(a.user_id)?.full_name || 'Unknown',
            }));

            setAllAttendance(enriched);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to load attendance');
        } finally {
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
            const userMap = new Map<number, User>();
            userList.forEach((u: User) => {
                userMap.set(u.id, u);
            });
            setUsers(userMap);
        } catch (err: any) {
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
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to check in');
        } finally {
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
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to check out');
        } finally {
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
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
                        <p className="text-gray-600">Check-in and check-out for today</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-red-800">{error}</div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="text-green-800">{successMessage}</div>
                        </div>
                    )}

                    {todayAttendance ? (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Status</h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Check-in</label>
                                    <div className="flex items-center gap-3 mt-2">
                                        <LogIn className="w-5 h-5 text-green-600" />
                                        <span className="text-gray-900">
                                            {new Date(todayAttendance.check_in).toLocaleTimeString()}
                                        </span>
                                        {todayAttendance.is_late && (
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                LATE
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {todayAttendance.check_out ? (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Check-out</label>
                                        <div className="flex items-center gap-3 mt-2">
                                            <LogOut className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-900">
                                                {new Date(todayAttendance.check_out).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleCheckOut}
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400"
                                    >
                                        <LogOut className="w-4 h-4 inline mr-2" />
                                        {loading ? 'Checking out...' : 'Check Out'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Not Checked In</h2>

                            <p className="text-gray-600 mb-6">
                                Click the button below to check in for today. Make sure you have an approved schedule.
                            </p>

                            <button
                                onClick={handleCheckIn}
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:bg-gray-400 text-lg"
                            >
                                <LogIn className="w-5 h-5 inline mr-2" />
                                {loading ? 'Checking in...' : 'Check In'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Manager View
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
                    <p className="text-gray-600">Monitor staff attendance and late arrivals</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-red-800">{error}</div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
                            <select
                                value={selectedUserId || ''}
                                onChange={(e) =>
                                    setSelectedUserId(e.target.value ? parseInt(e.target.value) : undefined)
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Staff</option>
                                {usersList.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Attendance Records */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Attendance Records {loading && <span className="text-sm text-gray-500">Loading...</span>}
                    </h2>

                    {allAttendance.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No attendance records found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Staff Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Check-in
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Check-out
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Duration
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {allAttendance.map((record) => {
                                        const checkInTime = new Date(record.check_in);
                                        const checkOutTime = record.check_out ? new Date(record.check_out) : null;
                                        const duration = checkOutTime
                                            ? Math.round(
                                                  (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)
                                              )
                                            : null;

                                        return (
                                            <tr key={record.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {record.user_name}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {checkInTime.toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {checkInTime.toLocaleTimeString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {checkOutTime ? checkOutTime.toLocaleTimeString() : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {duration ? `${duration} min` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {record.is_late ? (
                                                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                            <AlertCircle className="w-3 h-3" />
                                                            LATE
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                            <CheckCircle className="w-3 h-3" />
                                                            ON TIME
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
