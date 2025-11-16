import { useState, useEffect } from 'react';
import { Sweet } from '../../types';
import { X } from 'lucide-react';

interface SweetFormModalProps {
  sweet?: Sweet;
  onClose: () => void;
  onSubmit: (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function SweetFormModal({ sweet, onClose, onSubmit }: SweetFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Indian Sweet');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sweet) {
      setName(sweet.name);
      setCategory(sweet.category);
      setPrice(sweet.price.toString());
      setQuantity(sweet.quantity.toString());
      setDescription(sweet.description);
      setImageUrl(sweet.image_url);
    }
  }, [sweet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
        image_url: imageUrl,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeInUp">
      <div className="glass-effect rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto card-shadow animate-scaleIn">
        <div className="sticky top-0 glass-effect backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-700 bg-clip-text text-transparent">
            {sweet ? 'Edit Sweet' : 'Add New Sweet'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100/50 rounded-lg transition-all duration-300 transform hover:rotate-90"
          >
            <X className="w-5 h-5 text-amber-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm input-glow placeholder-gray-400"
              required
            />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm input-glow"
              required
            >
              <option value="Indian Sweet">Indian Sweet</option>
              <option value="Bengali Sweet">Bengali Sweet</option>
              <option value="Cakes">Cakes</option>
              <option value="Pastries">Pastries</option>
              <option value="Cookies">Cookies</option>
              <option value="International Sweet">International Sweet</option>
              <option value="Sugar-free">Sugar-free</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm input-glow placeholder-gray-400"
              required
            />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm input-glow placeholder-gray-400"
              required
            />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm input-glow placeholder-gray-400 resize-none"
            />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200/50 rounded-lg bg-white/50 backdrop-blur-sm input-glow placeholder-gray-400"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-white/20 bg-white/30 hover:bg-white/50 backdrop-blur text-gray-700 font-medium rounded-lg transition-all duration-300 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-600/30 transform hover:-translate-y-0.5"
            >
              {loading ? 'Saving...' : sweet ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
