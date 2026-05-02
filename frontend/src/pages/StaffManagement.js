import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
const StaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'staff',
        position: '',
        hourly_rate: 0,
    });
    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (roleFilter)
                params.role = roleFilter;
            if (statusFilter)
                params.is_active = statusFilter === 'active';
            const response = await usersAPI.getAll(params);
            setUsers(response.data.data);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch users');
            console.error('Error fetching users:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter]);
    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'hourly_rate' ? parseFloat(value) || 0 : value,
        }));
    };
    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            // Validation
            if (!formData.email || !formData.full_name || !formData.role) {
                setError('Email, full name, and role are required');
                return;
            }
            if (!editingId && !formData.password) {
                setError('Password is required for new users');
                return;
            }
            if (editingId) {
                // Update existing user
                const updateData = { ...formData };
                delete updateData.password; // Don't send password if not changing
                if (!formData.password)
                    delete updateData.password;
                await usersAPI.update(editingId, updateData);
                setSuccessMessage('User updated successfully');
            }
            else {
                // Create new user
                await usersAPI.create(formData);
                setSuccessMessage('User created successfully');
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
                email: '',
                password: '',
                full_name: '',
                phone: '',
                role: 'staff',
                position: '',
                hourly_rate: 0,
            });
            // Refresh the list
            await fetchUsers();
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to save user');
            console.error('Error saving user:', err);
        }
    };
    // Handle edit
    const handleEdit = (user) => {
        setFormData({
            email: user.email,
            full_name: user.full_name,
            phone: user.phone || '',
            role: user.role,
            position: user.position || '',
            hourly_rate: user.hourly_rate,
        });
        setEditingId(user.id);
        setShowForm(true);
    };
    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) {
            return;
        }
        try {
            setError(null);
            await usersAPI.delete(id);
            setSuccessMessage('User deactivated successfully');
            await fetchUsers();
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to delete user');
            console.error('Error deleting user:', err);
        }
    };
    // Handle cancel form
    const handleCancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            email: '',
            password: '',
            full_name: '',
            phone: '',
            role: 'staff',
            position: '',
            hourly_rate: 0,
        });
    };
    return (_jsx("div", { className: "p-8 bg-gray-50 min-h-screen", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Staff Management" }), _jsxs("button", { onClick: () => setShowForm(!showForm), className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition", children: [_jsx(Plus, { size: 20 }), "Add New Staff"] })] }), successMessage && (_jsx("div", { className: "mb-4 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700", children: successMessage })), error && (_jsxs("div", { className: "mb-4 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-2 text-red-700", children: [_jsx(AlertCircle, { size: 20 }), error] })), showForm && (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: editingId ? 'Edit User' : 'Create New User' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email *" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, disabled: !!editingId, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100", required: true })] }), !editingId && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password *" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name *" }), _jsx("input", { type: "text", name: "full_name", value: formData.full_name, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Role *" }), _jsxs("select", { name: "role", value: formData.role, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [_jsx("option", { value: "staff", children: "Staff" }), _jsx("option", { value: "pos", children: "POS" }), _jsx("option", { value: "manager", children: "Manager" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Position" }), _jsx("input", { type: "text", name: "position", value: formData.position, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Hourly Rate" }), _jsx("input", { type: "number", name: "hourly_rate", value: formData.hourly_rate, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", step: "1000" })] })] }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx("button", { type: "submit", className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition", children: editingId ? 'Update User' : 'Create User' }), _jsx("button", { type: "button", onClick: handleCancelForm, className: "bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition", children: "Cancel" })] })] })] })), _jsx("div", { className: "bg-white rounded-lg shadow-md p-4 mb-6", children: _jsxs("div", { className: "flex gap-4", children: [_jsxs("select", { value: roleFilter, onChange: e => setRoleFilter(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Roles" }), _jsx("option", { value: "staff", children: "Staff" }), _jsx("option", { value: "pos", children: "POS" }), _jsx("option", { value: "manager", children: "Manager" })] }), _jsxs("select", { value: statusFilter, onChange: e => setStatusFilter(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: loading ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: "Loading..." })) : users.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: "No users found" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-100 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Role" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Position" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Hourly Rate" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-medium text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { children: users.map(user => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: user.full_name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: user.email }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${user.role === 'manager'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : user.role === 'pos'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'}`, children: user.role.charAt(0).toUpperCase() +
                                                        user.role.slice(1) }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: user.position || '-' }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-500", children: [user.hourly_rate.toLocaleString(), " \u0111/h"] }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${user.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'}`, children: user.is_active ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(user), className: "p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition", children: _jsx(Edit2, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(user.id), className: "p-2 text-red-600 hover:bg-red-100 rounded-lg transition", children: _jsx(Trash2, { size: 18 }) })] }) })] }, user.id))) })] }) })) })] }) }));
};
export default StaffManagement;
