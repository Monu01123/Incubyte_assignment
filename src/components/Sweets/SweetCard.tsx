import { useState } from 'react';
import { Sweet } from '../../types';
import { ShoppingCart, Package, Edit, Trash2 } from 'lucide-react';

interface SweetCardProps {
  sweet: Sweet;
  isAdmin: boolean;
  onPurchase: (sweetId: string, quantity: number) => Promise<void>;
  onRestock: (sweetId: string, quantity: number) => Promise<void>;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: string) => Promise<void>;
}

export function SweetCard({ sweet, isAdmin, onPurchase, onRestock, onEdit, onDelete }: SweetCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await onPurchase(sweet.id, quantity);
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    setLoading(true);
    try {
      await onRestock(sweet.id, quantity);
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
        {sweet.image_url ? (
          <img src={sweet.image_url} alt={sweet.name} className="h-full w-full object-cover" />
        ) : (
          <Package className="w-16 h-16 text-amber-600" />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(sweet)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(sweet.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
            {sweet.category}
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            sweet.quantity > 10
              ? 'bg-green-100 text-green-800'
              : sweet.quantity > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {sweet.quantity} in stock
          </span>
        </div>

        {sweet.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sweet.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-amber-600">${sweet.price.toFixed(2)}</span>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            min="1"
            max={isAdmin ? 1000 : sweet.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <button
            onClick={handlePurchase}
            disabled={sweet.quantity === 0 || loading}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {loading ? 'Processing...' : 'Purchase'}
          </button>
        </div>

        {isAdmin && (
          <button
            onClick={handleRestock}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            {loading ? 'Processing...' : 'Restock'}
          </button>
        )}
      </div>
    </div>
  );
}
