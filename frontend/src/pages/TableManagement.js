import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Table2, Plus, Edit2, Trash2, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { tablesAPI } from '../services/api';
export default function TableManagement() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: '',
        status: 'available',
        qrCode: '',
    });
    const { user } = useAuth();
    const isManager = user?.role === 'manager';
    const normalizeList = (payload) => {
        if (Array.isArray(payload))
            return payload;
        if (Array.isArray(payload?.items))
            return payload.items;
        if (Array.isArray(payload?.data))
            return payload.data;
        if (Array.isArray(payload?.rows))
            return payload.rows;
        return [];
    };
    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await tablesAPI.getAll(filterAvailableOnly ? { available_only: 'true' } : undefined);
            setTables(normalizeList(response.data));
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load tables');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTables();
    }, [filterAvailableOnly]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const resetForm = () => {
        setFormData({ tableNumber: '', capacity: '', status: 'available', qrCode: '' });
        setEditingId(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!formData.tableNumber || !formData.capacity) {
            setError('Table number and capacity are required');
            return;
        }
        try {
            const payload = {
                tableNumber: formData.tableNumber,
                capacity: Number(formData.capacity),
                status: formData.status,
                qrCode: formData.qrCode || null,
            };
            if (editingId) {
                await tablesAPI.update(editingId, payload);
                setSuccessMessage('Table updated successfully');
            }
            else {
                await tablesAPI.create(payload);
                setSuccessMessage('Table created successfully');
            }
            resetForm();
            setShowForm(false);
            await fetchTables();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to save table');
        }
    };
    const handleEdit = (table) => {
        setFormData({
            tableNumber: table.table_number,
            capacity: table.capacity.toString(),
            status: table.status,
            qrCode: table.qr_code || '',
        });
        setEditingId(table.id);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this table?'))
            return;
        try {
            await tablesAPI.delete(id);
            setSuccessMessage('Table deleted successfully');
            await fetchTables();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to delete table');
        }
    };
    const getStatusStyle = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'occupied':
                return 'bg-red-100 text-red-800';
            case 'reserved':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const totalTables = tables.length;
    const availableTables = tables.filter((table) => table.status === 'available').length;
    const occupiedTables = tables.filter((table) => table.status === 'occupied').length;
    return (_jsx("div", { className: "min-h-screen bg-gray-100 p-4 md:p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "mb-8 flex items-center justify-between flex-wrap gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(Table2, { className: "w-8 h-8" }), "Table Management"] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage seating layout and QR codes." })] }), isManager && (_jsxs("button", { onClick: () => setShowForm((prev) => !prev), className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), showForm ? 'Close Form' : 'Add Table'] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Tables" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: totalTables })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Available" }), _jsx("p", { className: "text-3xl font-bold text-green-600", children: availableTables })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Occupied" }), _jsx("p", { className: "text-3xl font-bold text-red-600", children: occupiedTables })] })] }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("div", { children: error })] })), successMessage && (_jsxs("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("div", { children: successMessage })] })), _jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("button", { onClick: () => setFilterAvailableOnly((prev) => !prev), className: `px-4 py-2 rounded ${filterAvailableOnly
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-800'}`, children: filterAvailableOnly ? 'Showing Available Only' : 'Show Available Only' }), _jsxs("span", { className: "text-sm text-gray-500 flex items-center gap-1", children: [_jsx(Lock, { className: "w-4 h-4" }), "Manager actions only"] })] }), showForm && isManager && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: editingId ? 'Edit Table' : 'Add New Table' }), _jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Table Number *" }), _jsx("input", { name: "tableNumber", value: formData.tableNumber, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Capacity *" }), _jsx("input", { type: "number", name: "capacity", value: formData.capacity, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", min: "1", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { name: "status", value: formData.status, onChange: handleInputChange, className: "w-full border rounded px-3 py-2", children: [_jsx("option", { value: "available", children: "Available" }), _jsx("option", { value: "occupied", children: "Occupied" }), _jsx("option", { value: "reserved", children: "Reserved" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "QR Code" }), _jsx("input", { name: "qrCode", value: formData.qrCode, onChange: handleInputChange, className: "w-full border rounded px-3 py-2" })] }), _jsxs("div", { className: "md:col-span-4 flex gap-2", children: [_jsx("button", { type: "submit", className: "bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700", children: editingId ? 'Update' : 'Create' }), _jsx("button", { type: "button", onClick: resetForm, className: "bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400", children: "Reset" })] })] })] })), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: loading ? (_jsx("div", { className: "p-8 text-center text-gray-600", children: "Loading tables..." })) : tables.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-600", children: "No tables found" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Table" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Capacity" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "QR Code" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y", children: tables.map((table) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 font-medium text-gray-900", children: table.table_number }), _jsx("td", { className: "px-6 py-4 text-center text-gray-700", children: table.capacity }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx("span", { className: `inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(table.status)}`, children: table.status }) }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: table.qr_code || 'N/A' }), _jsx("td", { className: "px-6 py-4 text-center", children: isManager && (_jsxs("div", { className: "flex justify-center gap-2", children: [_jsx("button", { onClick: () => handleEdit(table), className: "bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(table.id), className: "bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) })] }, table.id))) })] }) })) })] }) }));
}
