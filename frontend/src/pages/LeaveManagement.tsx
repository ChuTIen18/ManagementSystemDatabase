import { useEffect, useState } from 'react';
import { leaveRequestsAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    Filter,
    Plus,
    Trash2,
    FileText,
} from 'lucide-react';

interface LeaveRequest {
    id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: number;
    request_date: string;
}

interface User {
    id: number;
    full_name: string;
    email: string;
}

interface LeaveRequestWithUser extends LeaveRequest {
    user_name?: string;
}

export default function LeaveManagement() {
    const { user } = useAuth();
    const isManager = user?.role === 'manager';

    const [leaveRequests, setLeaveRequests] = useState<LeaveRequestWithUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState<Map<number, User>>(new Map());
    const [usersList, setUsersList] = useState<User[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        reason: '',
    });

    // Filters
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
    const [startDateFilter, setStartDateFilter] = useState(
        new Date().toISOString().split('T')[0]
    );

    const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
        pending: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            icon: Clock,
        },
        approved: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            icon: CheckCircle,
        },
        rejected: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            icon: AlertCircle,
        },
    };

    const calculateDays = (start: string, end: string): number => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };

    // Fetch leave requests
    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const params: any = {};

            if (selectedStatus) params.status = selectedStatus;
            if (!isManager && selectedUserId) {
                // Staff can only view own
                params.user_id = user?.id;
            } else if (isManager && selectedUserId) {
                params.user_id = selectedUserId;
            }

            const response = await leaveRequestsAPI.getAll(params);
            const requests = response.data.data || [];

            // Enrich with user names
            const enriched = requests.map((lr: LeaveRequest) => ({
                ...lr,
                user_name: users.get(lr.user_id)?.full_name || 'Unknown',
            }));

            setLeaveRequests(enriched);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll({ is_active: true });
            const userList = response.data.data || [];
            setUsersList(userList);

            const userMap = new Map<number, User>();
            userList.forEach((u: User) => {
                userMap.set(u.id, u);
            });
            setUsers(userMap);
        } catch (err: any) {
            console.error('Error fetching users:', err);
        }
    };

    // Create leave request
    const handleCreateRequest = async () => {
        try {
            setLoading(true);
            setError('');

            if (!formData.start_date || !formData.end_date) {
                setError('Start date and end date are required');
                setLoading(false);
                return;
            }

            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);

            if (start > end) {
                setError('Start date must be before end date');
                setLoading(false);
                return;
            }

            await leaveRequestsAPI.create({
                start_date: formData.start_date,
                end_date: formData.end_date,
                reason: formData.reason || null,
            });

            setSuccessMessage('✓ Leave request created successfully');
            setFormData({
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
                reason: '',
            });
            setShowForm(false);
            fetchLeaveRequests();

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create leave request');
        } finally {
            setLoading(false);
        }
    };

    // Approve leave request
    const handleApprove = async (requestId: number) => {
        try {
            setLoading(true);
            await leaveRequestsAPI.approve(requestId);
            setSuccessMessage('✓ Leave request approved');
            fetchLeaveRequests();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to approve');
        } finally {
            setLoading(false);
        }
    };

    // Reject leave request
    const handleReject = async (requestId: number) => {
        try {
            setLoading(true);
            await leaveRequestsAPI.reject(requestId);
            setSuccessMessage('✓ Leave request rejected');
            fetchLeaveRequests();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to reject');
        } finally {
            setLoading(false);
        }
    };

    // Cancel leave request
    const handleCancel = async (requestId: number) => {
        if (!window.confirm('Are you sure you want to cancel this leave request?')) return;

        try {
            setLoading(true);
            await leaveRequestsAPI.delete(requestId);
            setSuccessMessage('✓ Leave request cancelled');
            fetchLeaveRequests();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to cancel');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchLeaveRequests();
    }, [selectedStatus, selectedUserId, users.size]);

    // Staff View
    if (!isManager) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
                        <p className="text-gray-600">Request and track your leave</p>
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

                    {/* Request Form */}
                    {showForm && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Leave</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, start_date: e.target.value })
                                            }
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, end_date: e.target.value })
                                            }
                                            min={formData.start_date}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason (Optional)
                                    </label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reason: e.target.value })
                                        }
                                        rows={3}
                                        placeholder="Enter reason for leave..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {formData.start_date && formData.end_date && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <p className="text-sm text-blue-800">
                                            <strong>Total Days:</strong>{' '}
                                            {calculateDays(formData.start_date, formData.end_date)} days
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCreateRequest}
                                        disabled={loading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mb-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Request Leave
                        </button>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex gap-3 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="space-y-4">
                        {loading && !leaveRequests.length ? (
                            <div className="text-center py-8 text-gray-500">Loading...</div>
                        ) : leaveRequests.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No leave requests yet</p>
                            </div>
                        ) : (
                            leaveRequests.map((request) => {
                                const statusColor = statusColors[request.status];
                                const StatusIcon = statusColor.icon;
                                const days = calculateDays(request.start_date, request.end_date);

                                return (
                                    <div
                                        key={request.id}
                                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Calendar className="w-5 h-5 text-gray-600" />
                                                    <span className="font-semibold text-gray-900">
                                                        {new Date(request.start_date).toLocaleDateString()} -{' '}
                                                        {new Date(request.end_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 ml-8">
                                                    <strong>{days} days</strong>
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center gap-1 ${statusColor.bg} ${statusColor.text} px-3 py-1 rounded-full text-sm font-semibold`}
                                            >
                                                <StatusIcon className="w-4 h-4" />
                                                {request.status.charAt(0).toUpperCase() +
                                                    request.status.slice(1)}
                                            </span>
                                        </div>

                                        {request.reason && (
                                            <div className="flex gap-3 mb-4">
                                                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-700">{request.reason}</p>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500 mb-4">
                                            Requested on{' '}
                                            {new Date(request.request_date).toLocaleDateString()}
                                        </div>

                                        {request.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(request.id)}
                                                disabled={loading}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm inline-flex items-center gap-2 transition disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Cancel Request
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Manager View
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
                    <p className="text-gray-600">Manage staff leave requests and approvals</p>
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

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Staff Member
                            </label>
                            <select
                                value={selectedUserId || ''}
                                onChange={(e) =>
                                    setSelectedUserId(
                                        e.target.value ? parseInt(e.target.value) : undefined
                                    )
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {loading && !leaveRequests.length ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : leaveRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No leave requests found</p>
                        </div>
                    ) : (
                        leaveRequests.map((request) => {
                            const statusColor = statusColors[request.status];
                            const StatusIcon = statusColor.icon;
                            const days = calculateDays(request.start_date, request.end_date);

                            return (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {request.user_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(request.start_date).toLocaleDateString()} -{' '}
                                                        {new Date(request.end_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 ml-0">
                                                <strong>{days} days</strong>
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center gap-1 ${statusColor.bg} ${statusColor.text} px-3 py-1 rounded-full text-sm font-semibold`}
                                        >
                                            <StatusIcon className="w-4 h-4" />
                                            {request.status.charAt(0).toUpperCase() +
                                                request.status.slice(1)}
                                        </span>
                                    </div>

                                    {request.reason && (
                                        <div className="flex gap-3 mb-4">
                                            <FileText className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-700">{request.reason}</p>
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-500 mb-4">
                                        Requested on{' '}
                                        {new Date(request.request_date).toLocaleDateString()}
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApprove(request.id)}
                                                disabled={loading}
                                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400 inline-flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                disabled={loading}
                                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400 inline-flex items-center gap-2"
                                            >
                                                <AlertCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
