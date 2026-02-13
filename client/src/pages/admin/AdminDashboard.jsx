import { useState } from 'react';
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

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Mock data
  const stats = [
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12.5%',
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      title: 'Total Revenue',
      value: '₹12,45,000',
      change: '+8.2%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: '856',
      change: '+5.4%',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Pending Orders',
      value: '42',
      change: '-3.1%',
      icon: Clock,
      color: 'yellow'
    }
  ];

  const allOrders = [
    {
      id: 'ORD001',
      clientName: 'Rahul Sharma',
      clientEmail: 'rahul@example.com',
      service: 'Salary (Basic) ITR',
      date: '2024-01-15',
      status: 'completed',
      amount: '₹799',
      assignedCA: 'CA Rajesh Kumar'
    },
    {
      id: 'ORD002',
      clientName: 'Priya Patel',
      clientEmail: 'priya@example.com',
      service: 'GST Registration',
      date: '2024-02-01',
      status: 'in-progress',
      amount: '₹1,499',
      assignedCA: 'CA Meera Singh'
    },
    {
      id: 'ORD003',
      clientName: 'Amit Kumar',
      clientEmail: 'amit@example.com',
      service: 'Business & Profession',
      date: '2024-02-05',
      status: 'pending',
      amount: '₹2,999',
      assignedCA: 'Not Assigned'
    }
  ];

  const allUsers = [
    {
      id: 'USR001',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      joinDate: '2024-01-10',
      orders: 3,
      status: 'active'
    },
    {
      id: 'USR002',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      joinDate: '2024-01-28',
      orders: 1,
      status: 'active'
    }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'All Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;

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
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
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
        <div className="space-y-3">
          {allOrders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-slate-900">{order.clientName}</p>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-slate-600">{order.service} • {order.id}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{order.amount}</p>
                <p className="text-sm text-slate-600">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
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
            {allOrders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 text-sm font-medium text-slate-900">{order.id}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Join Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Orders</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 text-sm font-medium text-slate-900">{user.id}</td>
                <td className="py-4 px-4 text-sm font-medium text-slate-900">{user.name}</td>
                <td className="py-4 px-4 text-sm text-slate-700">{user.email}</td>
                <td className="py-4 px-4 text-sm text-slate-700">{user.phone}</td>
                <td className="py-4 px-4 text-sm text-slate-600">{user.joinDate}</td>
                <td className="py-4 px-4 text-sm font-semibold text-slate-900">{user.orders}</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Active
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActive
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
