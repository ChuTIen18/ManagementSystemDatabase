import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, Edit2, Plus, AlertCircle, Wrench } from 'lucide-react';
import { equipmentAPI, usersAPI } from '../services/api';
const getResponseList = (payload) => {
    if (Array.isArray(payload))
        return payload;
    if (Array.isArray(payload?.data))
        return payload.data;
    if (Array.isArray(payload?.data?.items))
        return payload.data.items;
    if (Array.isArray(payload?.items))
        return payload.items;
    if (Array.isArray(payload?.users))
        return payload.users;
    if (Array.isArray(payload?.equipment))
        return payload.equipment;
    return [];
};
export default function EquipmentManagement() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const isManager = user?.role === 'manager';
    const [maintenanceData, setMaintenanceData] = useState({
        maintenance_type: '',
        description: '',
        cost: '',
    });
    const [formData, setFormData] = useState({
        equipment_name: '',
        equipment_type: '',
        purchase_date: '',
        purchase_cost: '',
        warranty_expiry: '',
        location: '',
        status: 'working',
    });
    // Fetch equipment
    const fetchEquipment = async () => {
        try {
            setLoading(true);
            setError('');
            const params = {};
            if (filterStatus)
                params.status = filterStatus;
            if (filterType)
                params.type = filterType;
            const response = await equipmentAPI.getAll(params);
            setEquipment(getResponseList(response.data));
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch equipment');
        }
        finally {
            setLoading(false);
        }
    };
    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(getResponseList(response.data));
        }
        catch (err) {
            console.error('Failed to fetch users');
        }
    };
    useEffect(() => {
        fetchEquipment();
        fetchUsers();
    }, [filterStatus, filterType]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleMaintenanceChange = (e) => {
        const { name, value } = e.target;
        setMaintenanceData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!formData.equipment_name || !formData.equipment_type || !formData.purchase_date) {
            setError('Equipment name, type, and purchase date are required');
            return;
        }
        try {
            if (editingId) {
                // Update equipment
                await equipmentAPI.update(editingId, {
                    equipment_name: formData.equipment_name,
                    equipment_type: formData.equipment_type,
                    purchase_date: formData.purchase_date,
                    purchase_cost: parseFloat(formData.purchase_cost) || 0,
                    warranty_expiry: formData.warranty_expiry || null,
                    location: formData.location || null,
                    status: formData.status,
                });
                setSuccessMessage('Equipment updated successfully');
            }
            else {
                // Create new equipment
                await equipmentAPI.create({
                    equipment_name: formData.equipment_name,
                    equipment_type: formData.equipment_type,
                    purchase_date: formData.purchase_date,
                    purchase_cost: parseFloat(formData.purchase_cost) || 0,
                    warranty_expiry: formData.warranty_expiry || null,
                    location: formData.location || null,
                    status: formData.status,
                });
                setSuccessMessage('Equipment created successfully');
            }
            setFormData({
                equipment_name: '',
                equipment_type: '',
                purchase_date: '',
                purchase_cost: '',
                warranty_expiry: '',
                location: '',
                status: 'working',
            });
            setShowForm(false);
            setEditingId(null);
            await fetchEquipment();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to save equipment');
        }
    };
    const handleEdit = (item) => {
        setFormData({
            equipment_name: item.equipment_name,
            equipment_type: item.equipment_type,
            purchase_date: item.purchase_date,
            purchase_cost: item.purchase_cost.toString(),
            warranty_expiry: item.warranty_expiry || '',
            location: item.location || '',
            status: item.status,
        });
        setEditingId(item.id);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this equipment?')) {
            return;
        }
        try {
            setError('');
            await equipmentAPI.delete(id);
            setSuccessMessage('Equipment deleted successfully');
            await fetchEquipment();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to delete equipment');
        }
    };
    const openMaintenanceModal = (item) => {
        setSelectedEquipment(item);
        setMaintenanceData({
            maintenance_type: '',
            description: '',
            cost: '',
        });
        setShowMaintenanceModal(true);
    };
    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!selectedEquipment || !maintenanceData.maintenance_type) {
            setError('Please enter maintenance type');
            return;
        }
        try {
            await equipmentAPI.recordMaintenance(selectedEquipment.id, {
                maintenance_type: maintenanceData.maintenance_type,
                description: maintenanceData.description || null,
                cost: parseFloat(maintenanceData.cost) || 0,
            });
            setSuccessMessage('Maintenance recorded successfully');
            setShowMaintenanceModal(false);
            setSelectedEquipment(null);
            await fetchEquipment();
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to record maintenance');
        }
    };
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            equipment_name: '',
            equipment_type: '',
            purchase_date: '',
            purchase_cost: '',
            warranty_expiry: '',
            location: '',
            status: 'working',
        });
    };
    const getUserName = (userId) => {
        if (!userId)
            return 'System';
        const user = users.find((u) => u.id === userId);
        return user?.name || `User ${userId}`;
    };
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'working':
                return 'bg-green-100 text-green-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'broken':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const equipmentNeedingMaintenance = equipment.filter((item) => item.status === 'broken' ||
        item.status === 'maintenance' ||
        (item.last_maintained_at &&
            new Date().getTime() - new Date(item.last_maintained_at).getTime() >
                180 * 24 * 60 * 60 * 1000));
    const totalValue = equipment.reduce((sum, item) => sum + item.purchase_cost, 0);
    const uniqueTypes = Array.from(new Set(equipment.map((item) => item.equipment_type)));
    return (_jsx("div", { className: "min-h-screen bg-gray-100 p-4 md:p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("div", { className: "mb-8", children: _jsxs("h1", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(Wrench, { className: "w-8 h-8" }), "Equipment Management"] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Equipment" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: equipment.length })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Total Value" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: ["$", totalValue.toFixed(2)] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Needs Maintenance" }), _jsx("p", { className: "text-3xl font-bold text-orange-600", children: equipmentNeedingMaintenance.length })] })] }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsx("div", { children: error })] })), successMessage && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4", children: successMessage })), equipmentNeedingMaintenance.length > 0 && (_jsxs("div", { className: "bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded mb-4 flex items-start gap-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Maintenance Alert" }), _jsxs("p", { className: "text-sm", children: [equipmentNeedingMaintenance.length, " items need maintenance."] })] })] })), _jsxs("div", { className: "flex gap-4 mb-6 flex-wrap", children: [isManager && (_jsxs("button", { onClick: () => setShowForm(!showForm), className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), showForm ? 'Cancel' : 'Add Equipment'] })), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "working", children: "Working" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "broken", children: "Broken" })] }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Types" }), uniqueTypes.map((type) => (_jsx("option", { value: type, children: type }, type)))] })] }), showForm && isManager && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: editingId ? 'Edit Equipment' : 'Add New Equipment' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Equipment Name *" }), _jsx("input", { type: "text", name: "equipment_name", value: formData.equipment_name, onChange: handleInputChange, className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type *" }), _jsx("input", { type: "text", name: "equipment_type", value: formData.equipment_type, onChange: handleInputChange, placeholder: "e.g., Coffee Machine, Refrigerator", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Purchase Date *" }), _jsx("input", { type: "date", name: "purchase_date", value: formData.purchase_date, onChange: handleInputChange, className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Purchase Cost" }), _jsx("input", { type: "number", name: "purchase_cost", value: formData.purchase_cost, onChange: handleInputChange, placeholder: "0.00", min: "0", step: "0.01", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Warranty Expiry" }), _jsx("input", { type: "date", name: "warranty_expiry", value: formData.warranty_expiry, onChange: handleInputChange, className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Location" }), _jsx("input", { type: "text", name: "location", value: formData.location, onChange: handleInputChange, placeholder: "e.g., Kitchen, Storage", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { name: "status", value: formData.status, onChange: handleInputChange, className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "working", children: "Working" }), _jsx("option", { value: "maintenance", children: "Maintenance" }), _jsx("option", { value: "broken", children: "Broken" })] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { type: "submit", className: "bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700", children: [editingId ? 'Update' : 'Create', " Equipment"] }), _jsx("button", { type: "button", onClick: handleCancel, className: "bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400", children: "Cancel" })] })] })] })), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: loading ? (_jsx("div", { className: "p-8 text-center text-gray-600", children: "Loading equipment..." })) : equipment.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-600", children: "No equipment found" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Equipment Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Cost" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Warranty" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Last Maintenance" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y", children: equipment.map((item) => {
                                        const needsMaintenance = item.status === 'broken' ||
                                            item.status === 'maintenance' ||
                                            (item.last_maintained_at &&
                                                new Date().getTime() -
                                                    new Date(item.last_maintained_at).getTime() >
                                                    180 * 24 * 60 * 60 * 1000);
                                        const warrantyExpired = item.warranty_expiry &&
                                            new Date(item.warranty_expiry) < new Date();
                                        return (_jsxs("tr", { className: `hover:bg-gray-50 ${needsMaintenance ? 'bg-orange-50' : ''}`, children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: item.equipment_name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: item.equipment_type }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx("span", { className: `inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`, children: item.status.charAt(0).toUpperCase() +
                                                            item.status.slice(1) }) }), _jsxs("td", { className: "px-6 py-4 text-sm text-center font-semibold", children: ["$", item.purchase_cost.toFixed(2)] }), _jsx("td", { className: "px-6 py-4 text-sm text-center", children: item.warranty_expiry ? (_jsx("span", { className: warrantyExpired
                                                            ? 'text-red-600 font-semibold'
                                                            : 'text-gray-600', children: new Date(item.warranty_expiry).toLocaleDateString() })) : (_jsx("span", { className: "text-gray-400", children: "N/A" })) }), _jsx("td", { className: "px-6 py-4 text-sm text-center", children: item.last_maintained_at ? (_jsxs("div", { className: "text-gray-600", children: [new Date(item.last_maintained_at).toLocaleDateString(), _jsxs("div", { className: "text-xs text-gray-500", children: ["by", ' ', getUserName(item.last_maintained_by)] })] })) : (_jsx("span", { className: "text-gray-400", children: "Never" })) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx("div", { className: "flex gap-2 justify-center", children: isManager && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => openMaintenanceModal(item), className: "bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded text-xs", title: "Record Maintenance", children: "Maintain" }), _jsx("button", { onClick: () => handleEdit(item), className: "bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(item.id), className: "bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })) }) })] }, item.id));
                                    }) })] }) })) }), showMaintenanceModal && selectedEquipment && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg max-w-sm w-full p-6", children: [_jsxs("h3", { className: "text-xl font-bold mb-4", children: ["Record Maintenance - ", selectedEquipment.equipment_name] }), _jsxs("form", { onSubmit: handleMaintenanceSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Maintenance Type *" }), _jsx("input", { type: "text", name: "maintenance_type", value: maintenanceData.maintenance_type, onChange: handleMaintenanceChange, placeholder: "e.g., Regular Service, Repair", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { name: "description", value: maintenanceData.description, onChange: handleMaintenanceChange, placeholder: "Details about the maintenance performed", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 3 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cost" }), _jsx("input", { type: "number", name: "cost", value: maintenanceData.cost, onChange: handleMaintenanceChange, placeholder: "0.00", min: "0", step: "0.01", className: "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "submit", className: "flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700", children: "Record Maintenance" }), _jsx("button", { type: "button", onClick: () => setShowMaintenanceModal(false), className: "flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400", children: "Cancel" })] })] })] }) }))] }) }));
}
