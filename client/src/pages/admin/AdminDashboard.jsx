import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    FileText,
    Settings,
    LogOut,
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle,
    Search,
    Filter,
    Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import OrderDetails from '../dashboard/OrderDetails';
import api from '../../api/axios';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Data States
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState([
        { title: 'Total Orders', value: '0', change: '+0%', icon: ShoppingBag, color: 'blue' },
        { title: 'Total Revenue', value: '₹0', change: '+0%', icon: DollarSign, color: 'green' },
        { title: 'Active Users', value: '0', change: '+0%', icon: Users, color: 'purple' },
        { title: 'Pending Orders', value: '0', change: '0%', icon: Clock, color: 'yellow' }
    ]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Users and Orders in parallel for overview stats
            const [usersRes, ordersRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/itr/all')
            ]);

            const usersData = usersRes.data.data;
            const ordersData = ordersRes.data.data;

            setUsers(usersData);

            // Map Orders
            const mappedOrders = ordersData.map(itr => ({
                id: itr._id, // Keep full ID for query but maybe display short
                clientName: itr.userId?.name || 'Unknown',
                clientEmail: itr.userId?.email || 'Unknown',
                service: itr.purchaseId?.planId?.name || 'ITR Filing',
                date: new Date(itr.submittedAt).toLocaleDateString(),
                status: itr.status, // API status
                amount: itr.purchaseId?.planId?.price ? `₹${itr.purchaseId.planId.price}` : '-',
                assignedCA: itr.assignedCA?.name || 'Unassigned',
                originalData: itr
            }));
            setOrders(mappedOrders);

            // Calculate Stats
            calculateStats(usersData, mappedOrders);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (usersList, ordersList) => {
        const totalRevenue = ordersList.reduce((acc, order) => {
            const price = parseInt(order.amount.replace(/[^0-9]/g, '')) || 0;
            return acc + price;
        }, 0);

        const pendingCount = ordersList.filter(o => o.status === 'Pending' || o.status === 'pending').length;

        setStats([
            {
                title: 'Total Orders',
                value: ordersList.length.toString(),
                change: '+100%', // Mock change for now
                icon: ShoppingBag,
                color: 'blue'
            },
            {
                title: 'Total Revenue',
                value: `₹${totalRevenue.toLocaleString()}`,
                change: '+100%',
                icon: DollarSign,
                color: 'green'
            },
            {
                title: 'Active Users',
                value: usersList.length.toString(),
                change: '+100%',
                icon: Users,
                color: 'purple'
            },
            {
                title: 'Pending Orders',
                value: pendingCount.toString(),
                change: `${((pendingCount / ordersList.length || 0) * 100).toFixed(0)}%`,
                icon: Clock,
                color: 'yellow'
            }
        ]);
    };

    useEffect(() => {
        // Fetch data on mount or tab change (optimization: fetch once on mount or refresh on specific actions)
        // For simplicity, fetch all on mount to populate stats, then maybe refresh.
        fetchData();
    }, []);

    const getStatusBadge = (status) => {
        const statusLower = status?.toLowerCase() || 'pending';

        let config = { bg: 'bg-gray-100', text: 'text-gray-700', label: status };

        if (statusLower === 'completed' || statusLower === 'filed') {
            config = { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' };
        } else if (statusLower === 'in-progress' || statusLower === 'processing') {
            config = { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' };
        } else if (statusLower === 'pending') {
            config = { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
        } else if (statusLower === 'rejected' || statusLower === 'cancelled') {
            config = { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
        }

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                        blue: 'bg-blue-100 text-blue-600',
                        green: 'bg-green-100 text-green-600',
                        purple: 'bg-purple-100 text-purple-600',
                        yellow: 'bg-yellow-100 text-yellow-600'
                    };

                    return (
                        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`text-sm font-semibold text-green-600`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-slate-600 text-sm mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                        View All →
                    </button>
                </div>
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <div className="space-y-3">
                        {orders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="font-semibold text-slate-900">{order.clientName}</p>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <p className="text-sm text-slate-600">{order.service} • {order.id.substring(0, 8)}...</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{order.amount}</p>
                                    <p className="text-sm text-slate-600">{order.date}</p>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <p className="text-center text-slate-500">No recent orders.</p>}
                    </div>
                )}
            </div>
        </div>
    );

    const renderOrders = () => {
        const filteredOrders = orders.filter(order =>
            order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">All Orders</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                            <Filter size={18} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Order ID</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Client</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Service</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Assigned CA</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-sm font-medium text-slate-900">{order.id.substring(0, 8)}...</td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{order.clientName}</p>
                                                <p className="text-xs text-slate-600">{order.clientEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-slate-700">{order.service}</td>
                                        <td className="py-4 px-4 text-sm text-slate-600">{order.date}</td>
                                        <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                                        <td className="py-4 px-4 text-sm font-semibold text-slate-900">{order.amount}</td>
                                        <td className="py-4 px-4 text-sm text-slate-700">{order.assignedCA}</td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-slate-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderUsers = () => (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">All Users</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">User ID</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Phone</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Role</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-4 text-sm font-medium text-slate-900">{user._id.substring(0, 8)}...</td>
                                    <td className="py-4 px-4 text-sm font-medium text-slate-900">{user.name}</td>
                                    <td className="py-4 px-4 text-sm text-slate-700">{user.email}</td>
                                    <td className="py-4 px-4 text-sm text-slate-700">{user.mobile || '-'}</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-slate-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'orders':
                return renderOrders();
            case 'users':
                return renderUsers();
            case 'documents':
                return <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"><p className="text-slate-600">Documents management coming soon...</p></div>;
            case 'settings':
                return <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"><p className="text-slate-600">Settings coming soon...</p></div>;
            default:
                return renderOverview();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                                <p className="text-sm text-slate-600">Welcome back, {user?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {renderContent()}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
