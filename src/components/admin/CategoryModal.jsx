import { useState } from 'react';
import { X } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import toast from 'react-hot-toast';

export default function CategoryModal({ isOpen, onClose }) {
  const { addCategory } = useMenu();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🍽️',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const result = await addCategory({ ...formData, slug });
      if (result.success) {
        toast.success('Category added successfully');
        setFormData({ name: '', emoji: '🍽️' });
        onClose();
      } else {
        toast.error(result.error || 'Failed to add category');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Add New Category</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-brown outline-none"
                placeholder="e.g. Beverages"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emoji Icon</label>
              <input
                required
                type="text"
                name="emoji"
                value={formData.emoji}
                onChange={handleChange}
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-brown outline-none text-xl text-center"
                placeholder="☕"
              />
              <p className="text-xs text-gray-500 mt-1">Copy and paste a single emoji.</p>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-form"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-brown rounded-lg hover:bg-brown-dark transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
}
