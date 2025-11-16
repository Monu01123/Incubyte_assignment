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
    <div className="glass-effect rounded-xl overflow-hidden card-shadow-hover hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
      <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
        {sweet.image_url ? (
          <img src={sweet.image_url} alt={sweet.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-orange-300 blur-2xl opacity-30 animate-pulse"></div>
            <Package className="w-16 h-16 text-amber-600 relative animate-float" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-900 group-hover:to-orange-700 group-hover:bg-clip-text transition-all duration-300">{sweet.name}</h3>
          {isAdmin && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => onEdit(sweet)}
                className="p-2 bg-amber-100/80 hover:bg-amber-200 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <Edit className="w-4 h-4 text-amber-700" />
              </button>
              <button
                onClick={() => onDelete(sweet.id)}
                className="p-2 bg-red-100/80 hover:bg-red-200 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <Trash2 className="w-4 h-4 text-red-700" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-3 py-1 bg-gradient-to-r from-amber-100/80 to-orange-100/80 text-amber-800 text-xs font-medium rounded-full backdrop-blur border border-amber-200/50">
            {sweet.category}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur transition-all duration-300 ${
            sweet.quantity > 10
              ? 'bg-green-100/80 text-green-800 border border-green-200/50'
              : sweet.quantity > 0
              ? 'bg-yellow-100/80 text-yellow-800 border border-yellow-200/50'
              : 'bg-red-100/80 text-red-800 border border-red-200/50'
          }`}>
            {sweet.quantity} in stock
          </span>
        </div>

        {sweet.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sweet.description}</p>
        )}

        <div className="flex items-center justify-between mb-4 mt-auto">
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">${sweet.price.toFixed(2)}</span>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            min="1"
            max={isAdmin ? 1000 : sweet.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 border border-amber-200/50 rounded-lg bg-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
          />
          <button
            onClick={handlePurchase}
            disabled={sweet.quantity === 0 || loading}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-600/30 transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-4 h-4" />
            {loading ? 'Processing...' : 'Purchase'}
          </button>
        </div>

        {isAdmin && (
          <button
            onClick={handleRestock}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-600/30 transform hover:-translate-y-0.5"
          >
            <Package className="w-4 h-4" />
            {loading ? 'Processing...' : 'Restock'}
          </button>
        )}
      </div>
    </div>
  );
}
