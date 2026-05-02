import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { leaveRequestsAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, AlertCircle, CheckCircle, Clock, Filter, Plus, Trash2, FileText, } from 'lucide-react';
export default function LeaveManagement() {
    const { user } = useAuth();
    const isManager = user?.role === 'manager';
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState(new Map());
    const [usersList, setUsersList] = useState([]);
    // Form state
    const [formData, setFormData] = useState({
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        reason: '',
    });
    // Filters
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedUserId, setSelectedUserId] = useState();
    const [startDateFilter, setStartDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const statusColors = {
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
    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };
    // Fetch leave requests
    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedStatus)
                params.status = selectedStatus;
            if (!isManager && selectedUserId) {
                // Staff can only view own
                params.user_id = user?.id;
            }
            else if (isManager && selectedUserId) {
                params.user_id = selectedUserId;
            }
            const response = await leaveRequestsAPI.getAll(params);
            const requests = response.data.data || [];
            // Enrich with user names
            const enriched = requests.map((lr) => ({
                ...lr,
                user_name: users.get(lr.user_id)?.full_name || 'Unknown',
            }));
            setLeaveRequests(enriched);
            setError('');
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load leave requests');
        }
        finally {
            setLoading(false);
        }
    };
    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll({ is_active: true });
            const userList = response.data.data || [];
            setUsersList(userList);
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
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to create leave request');
        }
        finally {
            setLoading(false);
        }
    };
    // Approve leave request
    const handleApprove = async (requestId) => {
        try {
            setLoading(true);
            await leaveRequestsAPI.approve(requestId);
            setSuccessMessage('✓ Leave request approved');
            fetchLeaveRequests();
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to approve');
        }
        finally {
            setLoading(false);
        }
    };
    // Reject leave request
    const handleReject = async (requestId) => {
        try {
            setLoading(true);
            await leaveRequestsAPI.reject(requestId);
            setSuccessMessage('✓ Leave request rejected');
            fetchLeaveRequests();
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to reject');
        }
        finally {
            setLoading(false);
        }
    };
    // Cancel leave request
    const handleCancel = async (requestId) => {
        if (!window.confirm('Are you sure you want to cancel this leave request?'))
            return;
        try {
            setLoading(true);
            await leaveRequestsAPI.delete(requestId);
            setSuccessMessage('✓ Leave request cancelled');
            fetchLeaveRequests();
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to cancel');
        }
        finally {
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
        return (_jsx("div", { className: "min-h-screen bg-gray-50 p-8", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Leave Management" }), _jsx("p", { className: "text-gray-600", children: "Request and track your leave" })] }), error && (_jsxs("div", { className: "mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "text-red-800", children: error })] })), successMessage && (_jsxs("div", { className: "mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "text-green-800", children: successMessage })] })), showForm && (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Request Leave" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Start Date" }), _jsx("input", { type: "date", value: formData.start_date, onChange: (e) => setFormData({ ...formData, start_date: e.target.value }), min: new Date().toISOString().split('T')[0], className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "End Date" }), _jsx("input", { type: "date", value: formData.end_date, onChange: (e) => setFormData({ ...formData, end_date: e.target.value }), min: formData.start_date, className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reason (Optional)" }), _jsx("textarea", { value: formData.reason, onChange: (e) => setFormData({ ...formData, reason: e.target.value }), rows: 3, placeholder: "Enter reason for leave...", className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), formData.start_date && formData.end_date && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Total Days:" }), ' ', calculateDays(formData.start_date, formData.end_date), " days"] }) })), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleCreateRequest, disabled: loading, className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400", children: loading ? 'Submitting...' : 'Submit Request' }), _jsx("button", { onClick: () => setShowForm(false), className: "flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition", children: "Cancel" })] })] })] })), !showForm && (_jsxs("button", { onClick: () => setShowForm(true), className: "mb-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition inline-flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Request Leave"] })), _jsx("div", { className: "bg-white rounded-lg shadow-md p-4 mb-6", children: _jsx("div", { className: "flex gap-3 items-end", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { value: selectedStatus, onChange: (e) => setSelectedStatus(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "rejected", children: "Rejected" })] })] }) }) }), _jsx("div", { className: "space-y-4", children: loading && !leaveRequests.length ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Loading..." })) : leaveRequests.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Calendar, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "No leave requests yet" })] })) : (leaveRequests.map((request) => {
                            const statusColor = statusColors[request.status];
                            const StatusIcon = statusColor.icon;
                            const days = calculateDays(request.start_date, request.end_date);
                            return (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-gray-600" }), _jsxs("span", { className: "font-semibold text-gray-900", children: [new Date(request.start_date).toLocaleDateString(), " -", ' ', new Date(request.end_date).toLocaleDateString()] })] }), _jsx("p", { className: "text-sm text-gray-600 ml-8", children: _jsxs("strong", { children: [days, " days"] }) })] }), _jsxs("span", { className: `inline-flex items-center gap-1 ${statusColor.bg} ${statusColor.text} px-3 py-1 rounded-full text-sm font-semibold`, children: [_jsx(StatusIcon, { className: "w-4 h-4" }), request.status.charAt(0).toUpperCase() +
                                                        request.status.slice(1)] })] }), request.reason && (_jsxs("div", { className: "flex gap-3 mb-4", children: [_jsx(FileText, { className: "w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-gray-700", children: request.reason })] })), _jsxs("div", { className: "text-xs text-gray-500 mb-4", children: ["Requested on", ' ', new Date(request.request_date).toLocaleDateString()] }), request.status === 'pending' && (_jsxs("button", { onClick: () => handleCancel(request.id), disabled: loading, className: "text-red-600 hover:text-red-800 font-medium text-sm inline-flex items-center gap-2 transition disabled:opacity-50", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Cancel Request"] }))] }, request.id));
                        })) })] }) }));
    }
    // Manager View
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Leave Requests" }), _jsx("p", { className: "text-gray-600", children: "Manage staff leave requests and approvals" })] }), error && (_jsxs("div", { className: "mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "text-red-800", children: error })] })), successMessage && (_jsxs("div", { className: "mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" }), _jsx("div", { className: "text-green-800", children: successMessage })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Filter, { className: "w-5 h-5" }), "Filters"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Staff Member" }), _jsxs("select", { value: selectedUserId || '', onChange: (e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : undefined), className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Staff" }), usersList.map((u) => (_jsx("option", { value: u.id, children: u.full_name }, u.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { value: selectedStatus, onChange: (e) => setSelectedStatus(e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "rejected", children: "Rejected" })] })] })] })] }), _jsx("div", { className: "space-y-4", children: loading && !leaveRequests.length ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Loading..." })) : leaveRequests.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Calendar, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "No leave requests found" })] })) : (leaveRequests.map((request) => {
                        const statusColor = statusColors[request.status];
                        const StatusIcon = statusColor.icon;
                        const days = calculateDays(request.start_date, request.end_date);
                        return (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-3 mb-2", children: _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: request.user_name }), _jsxs("p", { className: "text-sm text-gray-600", children: [new Date(request.start_date).toLocaleDateString(), " -", ' ', new Date(request.end_date).toLocaleDateString()] })] }) }), _jsx("p", { className: "text-sm text-gray-600 ml-0", children: _jsxs("strong", { children: [days, " days"] }) })] }), _jsxs("span", { className: `inline-flex items-center gap-1 ${statusColor.bg} ${statusColor.text} px-3 py-1 rounded-full text-sm font-semibold`, children: [_jsx(StatusIcon, { className: "w-4 h-4" }), request.status.charAt(0).toUpperCase() +
                                                    request.status.slice(1)] })] }), request.reason && (_jsxs("div", { className: "flex gap-3 mb-4", children: [_jsx(FileText, { className: "w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-gray-700", children: request.reason })] })), _jsxs("div", { className: "text-xs text-gray-500 mb-4", children: ["Requested on", ' ', new Date(request.request_date).toLocaleDateString()] }), request.status === 'pending' && (_jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => handleApprove(request.id), disabled: loading, className: "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400 inline-flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Approve"] }), _jsxs("button", { onClick: () => handleReject(request.id), disabled: loading, className: "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400 inline-flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), "Reject"] })] }))] }, request.id));
                    })) })] }) }));
}
