import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, Plus, Link as LinkIcon, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../../utils/apiClient';
import { useAuth } from '../../context/AuthContext';

export default function QRCodesPage() {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = window.location.origin;

  useEffect(() => {
    async function fetchTables() {
      try {
        const res = await apiClient('/api/v1/tables');
        if (res.success) {
          setTables(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch tables:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTables();
  }, []);

  const getQrUrl = (tableNumber) => `${baseUrl}/menu?table=${tableNumber}`;

  const handleDownload = (tableNumber) => {
    toast.success(`QR Code for Table ${tableNumber} downloaded`);
  };

  const handleAddTable = async () => {
    const input = window.prompt("Enter new Table Number:");
    if (!input) return;
    
    const number = parseInt(input, 10);
    if (isNaN(number) || number <= 0) {
      toast.error("Please enter a valid positive table number.");
      return;
    }

    try {
      const res = await apiClient('/api/v1/tables', {
        method: 'POST',
        body: JSON.stringify({ number, label: `Table ${number}` })
      });

      if (res.success) {
        toast.success(`Table ${number} added successfully`);
        setTables([...tables, res.data]);
      } else {
        toast.error(res.error?.message || res.error || 'Failed to add table');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while adding table');
    }
  };

  const handlePrintAll = () => {
    window.print();
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading tables...</div>;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table QR Codes</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and print QR codes for your tables.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAddTable}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Table
          </button>
          <button 
            onClick={handlePrintAll}
            className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded-lg font-medium hover:bg-brown-dark transition-colors shadow-sm"
          >
            <Printer size={18} />
            Print All
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 print:hidden">
        <Settings size={20} className="text-blue-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-blue-900">How it works</h3>
          <p className="text-sm text-blue-800 mt-1">
            Print these QR codes and place them on your tables. When a customer scans the code, 
            their table number will be automatically attached to their order.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-3 print:gap-8">
        {tables.filter(t => t.isActive).map(table => {
          const url = getQrUrl(table.tableNumber);
          
          return (
            <div key={table.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Table {table.tableNumber}</h2>
              <p className="text-xs text-gray-500 mb-6 font-mono bg-gray-50 px-2 py-1 rounded">My Cafe</p>
              
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-6">
                <QRCodeSVG
                  value={url}
                  size={160}
                  bgColor={"#ffffff"}
                  fgColor={"#3A2F20"}
                  level={"H"}
                  includeMargin={false}
                />
              </div>

              <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-gray-100 print:hidden">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    toast.success('Link copied to clipboard');
                  }}
                  className="p-2 text-gray-500 hover:text-brown hover:bg-brown/10 rounded-lg transition-colors"
                  title="Copy Link"
                >
                  <LinkIcon size={18} />
                </button>
                <button 
                  onClick={() => handleDownload(table.tableNumber)}
                  className="flex items-center gap-2 text-sm font-medium text-brown hover:text-brown-dark bg-brown/10 hover:bg-brown/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

