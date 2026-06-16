import { useState } from 'react';
import { Clock, ChefHat, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import toast from 'react-hot-toast';

const STATUS_TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'new', label: 'New' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
];

export default function OrdersPage() {
  const { getOrdersByStatus, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('new');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const displayedOrders = getOrdersByStatus(activeTab);

  const handleStatusUpdate = (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'new') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'completed';
    
    if (nextStatus) {
      updateOrderStatus(orderId, nextStatus);
      toast.success(`Order #${orderId.split('-')[1]} moved to ${nextStatus}`);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const getTimeString = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6 fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage kitchen queue and order fulfillment.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1 flex overflow-x-auto scrollbar-hide flex-shrink-0 shadow-sm">
        {STATUS_TABS.map(tab => {
          const count = getOrdersByStatus(tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-brown text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              {count > 0 && tab.id !== 'all' && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Orders List */}
        <div className={`flex-1 overflow-y-auto pr-2 custom-scrollbar ${selectedOrder ? 'hidden lg:block lg:w-1/2' : 'w-full'}`}>
          <div className="space-y-4 pb-4">
            {displayedOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <ChefHat size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No orders found</h3>
                <p className="text-sm text-gray-500 mt-1">There are no orders in this status right now.</p>
              </div>
            ) : (
              displayedOrders.map(order => (
                <div 
                  key={order.id} 
                  className={`bg-white rounded-xl border p-4 transition-all cursor-pointer ${
                    selectedOrder?.id === order.id ? 'border-brown ring-1 ring-brown shadow-md' : 'border-gray-200 hover:border-brown/40 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brown-gradient text-white rounded-lg flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[10px] font-medium opacity-80 leading-none mb-0.5">Table</span>
                        <span className="text-lg font-bold leading-none">{order.tableNumber}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">#{order.id.split('-')[1]}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Clock size={12} />
                          {getTimeString(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4 line-clamp-1">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="font-bold text-gray-900">₹{order.total}</div>
                    
                    {order.status !== 'completed' ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(order.id, order.status);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brown/10 text-brown hover:bg-brown hover:text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        {order.status === 'new' ? 'Accept & Prepare' : order.status === 'preparing' ? 'Mark Ready' : 'Complete'}
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <CheckCircle2 size={16} /> Finished
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Details Pane */}
        {selectedOrder && (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden slide-up lg:animate-none">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
              <h2 className="font-bold text-gray-900">Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">#{selectedOrder.id.split('-')[1]}</h3>
                  <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-brown mb-1">T{selectedOrder.tableNumber}</div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              {selectedOrder.specialInstructions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Special Instructions</div>
                  <p className="text-sm text-yellow-900 italic">"{selectedOrder.specialInstructions}"</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">Items</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                        {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-gray-600 font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax (5%)</span>
                  <span>₹{selectedOrder.tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>
            
            {/* Action Bar */}
            {selectedOrder.status !== 'completed' && (
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, selectedOrder.status)}
                  className="w-full bg-brown-gradient text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {selectedOrder.status === 'new' ? 'Accept & Move to Preparing' : selectedOrder.status === 'preparing' ? 'Mark as Ready to Serve' : 'Complete Order'}
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
