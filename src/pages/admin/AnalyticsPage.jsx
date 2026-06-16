import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { getDailyRevenue, getTopItems } from '../../data/sampleOrders';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8B6F47', '#7A9E7E', '#5B9BD5', '#C07C56', '#D4A852'];

export default function AnalyticsPage() {
  const { orders } = useOrders();

  const revenueData = getDailyRevenue(orders);
  const topItems = getTopItems(orders).slice(0, 5);

  // Calculate category distribution
  const categoryCount = {};
  orders.forEach(order => {
    // Basic mock logic for category distribution based on item name matching
    order.items.forEach(item => {
      let cat = 'Other';
      if (item.name.includes('Coffee') || item.name.includes('Espresso') || item.name.includes('Latte') || item.name.includes('Mocha') || item.name.includes('Americano') || item.name.includes('Brew')) cat = 'Coffee';
      else if (item.name.includes('Tea') || item.name.includes('Chai') || item.name.includes('Matcha')) cat = 'Tea';
      else if (item.name.includes('Smoothie') || item.name.includes('Shake') || item.name.includes('Soda') || item.name.includes('Frappé')) cat = 'Cold Drinks';
      else if (item.name.includes('Cake') || item.name.includes('Tiramisu') || item.name.includes('Cheesecake') || item.name.includes('Brownie') || item.name.includes('Muffin') || item.name.includes('Cookie') || item.name.includes('Croissant')) cat = 'Desserts';
      else cat = 'Food';

      categoryCount[cat] = (categoryCount[cat] || 0) + item.quantity;
    });
  });

  const categoryData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  })).sort((a, b) => b.value - a.value);

  const totalRevenueAllTime = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Deep dive into your sales and menu performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 shadow-sm">
            <Calendar size={16} />
            <span>Last 7 Days</span>
          </div>
          <button className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded-lg font-medium hover:bg-brown-dark transition-colors shadow-sm">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Revenue (7d)</div>
          <div className="text-3xl font-bold text-gray-900">₹{totalRevenueAllTime.toLocaleString()}</div>
          <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> +8.4% vs previous
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Orders (7d)</div>
          <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
          <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> +12.1% vs previous
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Items Sold (7d)</div>
          <div className="text-3xl font-bold text-gray-900">{orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}</div>
          <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> +5.3% vs previous
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Daily Revenue</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(v) => `₹${v}`} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#8B6F47" strokeWidth={3} dot={{r: 4, fill: '#8B6F47', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Volume */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Daily Orders</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="orders" fill="#5B9BD5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Sales by Category</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40 space-y-3">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-600">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Items Detailed List */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Top Performing Items</h3>
          <div className="space-y-4">
            {topItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-gray-300 w-6">{i + 1}</div>
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.count} orders</div>
                  </div>
                </div>
                <div className="font-bold text-brown">₹{item.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
