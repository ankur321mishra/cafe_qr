import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { apiClient } from '../../utils/apiClient';
import toast from 'react-hot-toast';

export default function ItemModal({ isOpen, onClose, editingItem }) {
  const { categories, addItem, updateItem } = useMenu();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isPopular: false,
    isFeatured: false,
    isAvailable: true,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        price: editingItem.price || '',
        category: editingItem.category || categories[0]?.id || '',
        image: editingItem.image || '',
        isPopular: !!editingItem.isPopular,
        isFeatured: !!editingItem.isFeatured,
        isAvailable: editingItem.isAvailable !== false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories[0]?.id || '',
        image: '',
        isPopular: false,
        isFeatured: false,
        isAvailable: true,
      });
    }
  }, [editingItem, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price, 10),
      };

      if (editingItem) {
        payload.id = editingItem.id;
        const result = await updateItem(payload);
        if (result.success) {
          toast.success('Item updated successfully');
          onClose();
        } else {
          toast.error(result.error || 'Failed to update item');
        }
      } else {
        const result = await addItem(payload);
        if (result.success) {
          toast.success('Item added successfully');
          onClose();
        } else {
          toast.error(result.error || 'Failed to add item');
        }
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const form = new FormData();
      form.append('image', file);

      // Note: apiClient defaults to JSON, so we need to use raw fetch or pass config to omit Content-Type
      const token = localStorage.getItem('access_token'); // Or get it from context if needed. Since apiClient handles tokens, we'll configure it.
      // Wait, apiClient doesn't let us send FormData easily if it overrides Content-Type to application/json.
      // apiClient will automatically remove Content-Type for FormData
      const res = await apiClient('/api/v1/upload', {
        method: 'POST',
        body: form
      });

      if (res.success) {
        setFormData(prev => ({ ...prev, image: res.data.url }));
        toast.success('Image uploaded');
      } else {
        toast.error(res.error?.message || 'Failed to upload image');
      }
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <form id="item-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-brown outline-none"
                placeholder="Item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-brown outline-none"
                placeholder="Short description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  required
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-brown outline-none"
                  placeholder="e.g. 150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-brown outline-none"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              
              <div className="flex items-start gap-4">
                {formData.image && (
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden relative group">
                    <img src={formData.image.startsWith('http') ? formData.image : formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
                
                <div className="flex-1">
                  <label className={`flex flex-col items-center justify-center w-full ${formData.image ? 'h-20' : 'h-32'} border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 text-brown animate-spin mb-2" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      )}
                      <p className="text-sm text-gray-500 font-medium">
                        {isUploading ? 'Uploading...' : (formData.image ? 'Change image' : 'Click to upload image')}
                      </p>
                      {!formData.image && <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="rounded text-brown focus:ring-brown w-4 h-4"
                />
                Is Available
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleChange}
                  className="rounded text-brown focus:ring-brown w-4 h-4"
                />
                Popular
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="rounded text-brown focus:ring-brown w-4 h-4"
                />
                Featured
              </label>
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
            form="item-form"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-brown rounded-lg hover:bg-brown-dark transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
