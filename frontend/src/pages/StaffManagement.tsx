import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface User {
    id: number;
    email: string;
    full_name: string;
    phone?: string;
    role: 'staff' | 'pos' | 'manager';
    position?: string;
    hourly_rate: number;
    is_active: boolean;
}

interface FormData {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    role: 'staff' | 'pos' | 'manager';
    position: string;
    hourly_rate: number;
}

const StaffManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<FormData>>({
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
            const params: any = {};
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.is_active = statusFilter === 'active';

            const response = await usersAPI.getAll(params);
            setUsers(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter]);

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'hourly_rate' ? parseFloat(value) || 0 : value,
        }));
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
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
                if (!formData.password) delete updateData.password;

                await usersAPI.update(editingId, updateData);
                setSuccessMessage('User updated successfully');
            } else {
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
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to save user');
            console.error('Error saving user:', err);
        }
    };

    // Handle edit
    const handleEdit = (user: User) => {
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
    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) {
            return;
        }

        try {
            setError(null);
            await usersAPI.delete(id);
            setSuccessMessage('User deactivated successfully');
            await fetchUsers();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
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

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Add New Staff
                    </button>
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

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingId ? 'Edit User' : 'Create New User'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!!editingId}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                {!editingId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role *
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="pos">POS</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>

                                {/* Position */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Position
                                    </label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Hourly Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hourly Rate
                                    </label>
                                    <input
                                        type="number"
                                        name="hourly_rate"
                                        value={formData.hourly_rate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="1000"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    {editingId ? 'Update User' : 'Create User'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelForm}
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
                    <div className="flex gap-4">
                        <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Roles</option>
                            <option value="staff">Staff</option>
                            <option value="pos">POS</option>
                            <option value="manager">Manager</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No users found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                            Position
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                            Hourly Rate
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {user.full_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        user.role === 'manager'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : user.role === 'pos'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    {user.role.charAt(0).toUpperCase() +
                                                        user.role.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {user.position || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {user.hourly_rate.toLocaleString()} đ/h
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        user.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;
