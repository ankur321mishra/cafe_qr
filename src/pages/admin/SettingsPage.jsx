import { useState } from 'react';
import { Store, MapPin, Phone, MessageSquare, Receipt, Save, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your cafe profile and ordering preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Business Profile */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <Store size={18} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Business Profile</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cafe Name</label>
                  <input type="text" defaultValue="The Brew House" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brown focus:border-brown" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input type="email" defaultValue="hello@brewhouse.com" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brown focus:border-brown" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea rows="2" defaultValue="Artisanal coffee and fresh pastries in the heart of the city." className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brown focus:border-brown resize-none" />
              </div>
            </div>
          </div>

          {/* Ordering & Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <MessageSquare size={18} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Ordering & Notifications</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (for order alerts)</label>
                <div className="flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input type="text" defaultValue="9876543210" className="flex-1 block w-full px-3 py-2.5 border border-gray-300 rounded-none rounded-r-lg text-sm focus:ring-2 focus:ring-brown focus:border-brown" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">Accept Online Orders</div>
                  <div className="text-xs text-gray-500">Temporarily disable ordering (menu stays visible)</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Billing & Taxes */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <Receipt size={18} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Billing & Taxes</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brown focus:border-brown bg-white">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                  <input type="number" defaultValue="5" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brown focus:border-brown" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">Prices include tax</div>
                  <div className="text-xs text-gray-500">Menu prices shown already include taxes</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brown/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brown"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Theme & Save */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <Palette size={18} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Theme</h2>
            </div>
            <div className="p-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">Primary Color</label>
              <div className="flex flex-wrap gap-3">
                {['#8B6F47', '#4F46E5', '#059669', '#DC2626', '#EA580C'].map((color, i) => (
                  <button 
                    key={color} 
                    className={`w-10 h-10 rounded-full border-2 focus:outline-none ${i === 0 ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Theme changes apply to the customer-facing QR menu.</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-brown-gradient text-white py-3 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save size={18} />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
