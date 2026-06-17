import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { apiClient } from '../../utils/apiClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const { orders } = useOrders();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [dashRes, revRes, topRes] = await Promise.all([
          apiClient('/api/v1/analytics/dashboard'),
          apiClient('/api/v1/analytics/revenue?days=7'),
          apiClient('/api/v1/analytics/top-items?limit=5')
        ]);
        
        if (dashRes.success) setStats(dashRes.data);
        if (revRes.success) {
          // Format for chart: { day: 'Mon', revenue: 120 }
          const formatted = revRes.data.map(d => {
            const date = new Date(d.date);
            return {
              day: date.toLocaleDateString('en-US', { weekday: 'short' }),
              revenue: d.revenue,
              orders: Math.floor(d.revenue / 200) // mock orders count since API doesn't return it
            };
          });
          setRevenueData(formatted);
        }
        if (topRes.success) {
          // Format for chart: { name: 'Latte', count: 20 }
          setTopItems(topRes.data.map(i => ({ name: i.name, count: i.totalQuantity })));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (isLoading || !stats) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  const statCards = [
    { label: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: IndianRupee, change: `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%`, isUp: stats.revenueChange >= 0 },
    { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, change: `${stats.ordersChange > 0 ? '+' : ''}${stats.ordersChange}%`, isUp: stats.ordersChange >= 0 },
    { label: 'Avg Order Value', value: `₹${stats.avgOrderValue}`, icon: TrendingUp, change: '--', isUp: true },
    { label: 'Active Tables', value: `${stats.activeTables.active}/${stats.activeTables.total}`, icon: Users, change: 'Live', isUp: true },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome & Stats */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening at The Brew House today.</p>
      </div>

      {stats.newOrdersCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <p className="text-blue-800 font-medium text-sm">You have {stats.newOrdersCount} new order{stats.newOrdersCount !== 1 ? 's' : ''} waiting.</p>
          </div>
          <Link to="/admin/orders" className="text-sm font-bold text-blue-700 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors">
            View Orders
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-brown/10 text-brown flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${stat.isUp ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                  {stat.change}
                  <ArrowUpRight size={14} className={!stat.isUp ? 'rotate-90' : ''} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-900">Revenue Trend (Last 7 Days)</h2>
            <Link to="/admin/analytics" className="text-sm text-brown font-medium hover:underline">Full Report</Link>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8B6F47" strokeWidth={3} dot={{r: 4, fill: '#8B6F47', strokeWidth: 0}} activeDot={{r: 6, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
          <h2 className="text-base font-bold text-gray-900 mb-6">Top Selling Items</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#374151', fontSize: 12}} width={120} />
                <Tooltip
                  formatter={(value) => [`${value} orders`, 'Volume']}
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#D4B896" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-brown font-medium hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Table</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => {
                const timeStr = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="px-5 py-3">{timeStr}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">{order.tableNumber}</td>
                    <td className="px-5 py-3 max-w-[200px] truncate">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="px-5 py-3 font-medium">₹{order.total}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium status-${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

