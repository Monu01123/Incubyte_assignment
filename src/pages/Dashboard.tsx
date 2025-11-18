import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sweet } from '../types';
import { sweetsApi, inventoryApi } from '../services/api';
import { SweetCard } from '../components/Sweets/SweetCard';
import { SearchBar } from '../components/Sweets/SearchBar';
import { SweetFormModal } from '../components/Sweets/SweetFormModal';
import { Candy, Plus, LogOut, Shield } from 'lucide-react';

export function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | undefined>();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      const data = await sweetsApi.getAll();
      setSweets(data);
    } catch (error) {
      showNotification('error', 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      const data = await sweetsApi.search(params);
      setSweets(data);
    } catch (error) {
      showNotification('error', 'Search failed');
    }
  };

  const handlePurchase = async (sweetId: string, quantity: number) => {
    // This is kept for backward compatibility but cart is preferred
    try {
      await inventoryApi.purchase(sweetId, quantity);
      showNotification('success', 'Purchase successful!');
      await loadSweets();
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Purchase failed');
    }
  };

  const handleRestock = async (sweetId: string, quantity: number) => {
    try {
      await inventoryApi.restock(sweetId, quantity);
      showNotification('success', 'Restock successful!');
      await loadSweets();
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Restock failed');
    }
  };

  const handleCreateOrUpdate = async (sweetData: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingSweet) {
        await sweetsApi.update(editingSweet.id, sweetData);
        showNotification('success', 'Sweet updated successfully!');
      } else {
        await sweetsApi.create(sweetData);
        showNotification('success', 'Sweet created successfully!');
      }
      await loadSweets();
      setShowModal(false);
      setEditingSweet(undefined);
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Operation failed');
      throw error;
    }
  };

  const handleDelete = async (sweetId: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetsApi.delete(sweetId);
      showNotification('success', 'Sweet deleted successfully!');
      await loadSweets();
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingSweet(undefined);
    setShowModal(true);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen gradient-brand">

      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-fadeInUp backdrop-blur ${
          notification.type === 'success'
            ? 'bg-green-500/90 text-white border border-green-400/50'
            : 'bg-red-500/90 text-white border border-red-400/50'
        }`}>
          {notification.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-full shadow-2xl shadow-amber-600/50 animate-glow">
              <Candy className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-900 via-orange-700 to-amber-900 bg-clip-text text-transparent">
            Divine Sweets & Treats
          </h1>
          <p className="text-xl text-gray-700 mb-2 font-serif italic">
            "Blessed are those who share sweetness with others"
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the divine taste of traditional sweets, crafted with devotion and served with love
          </p>
          {isAdmin && (
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/30 transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Add New Sweet
              </button>
            </div>
          )}
        </div>

        <div className="animate-fadeInUp mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Decorative Elements */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
          </div>
          <div className="text-center relative">
            <span className="bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-2 text-amber-700 font-serif italic text-lg">
              ✨ Blessed Offerings ✨
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-amber-600/20 border-t-amber-600"></div>
              </div>
              <p className="text-amber-700 font-medium animate-pulse font-serif">Loading divine sweets...</p>
            </div>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20 animate-fadeInUp">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative p-6 rounded-full bg-gradient-to-br from-amber-100/50 to-orange-100/50 backdrop-blur">
                <Candy className="w-16 h-16 text-amber-400 animate-float" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2 font-serif">No sweets found</h3>
            <p className="text-gray-600 font-serif italic">
              {isAdmin ? 'Add your first blessed sweet to get started!' : 'Check back later for new divine offerings!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeInUp">
            {sweets.map((sweet, index) => (
              <div key={sweet.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fadeInUp">
                <SweetCard
                  sweet={sweet}
                  isAdmin={isAdmin}
                  onPurchase={handlePurchase}
                  onRestock={handleRestock}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer Quote */}
        {sweets.length > 0 && (
          <div className="mt-16 text-center animate-fadeInUp">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
              </div>
              <div className="relative bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur rounded-2xl p-8 border border-amber-200/50 shadow-lg">
                <p className="text-2xl font-serif italic text-amber-800 mb-2">
                  "May every sweet bring joy and blessings to your life"
                </p>
                <p className="text-gray-600 font-serif">- Divine Sweets & Treats</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <SweetFormModal
          sweet={editingSweet}
          onClose={() => {
            setShowModal(false);
            setEditingSweet(undefined);
          }}
          onSubmit={handleCreateOrUpdate}
        />
      )}
    </div>
  );
}
