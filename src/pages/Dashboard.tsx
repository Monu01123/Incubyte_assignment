import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sweet } from '../types';
import { sweetsApi, inventoryApi } from '../services/api';
import { SweetCard } from '../components/Sweets/SweetCard';
import { SearchBar } from '../components/Sweets/SearchBar';
import { SweetFormModal } from '../components/Sweets/SweetFormModal';
import { Candy, Plus, LogOut, Shield } from 'lucide-react';

export function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
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
      <nav className="glass-effect backdrop-blur-md border-b border-white/20 sticky top-0 z-40 animate-slideInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-lg shadow-lg shadow-amber-600/50 animate-glow">
                <Candy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-700 bg-clip-text text-transparent">Sweet Shop</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
              {isAdmin && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur border border-amber-200/50 rounded-lg hover-glow">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-medium text-amber-700">Admin</span>
                </div>
              )}
              {isAdmin && (
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/30 transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Add Sweet
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 backdrop-blur text-gray-700 font-medium rounded-lg transition-all duration-300 hover:shadow-md border border-white/20"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

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
        <div className="animate-fadeInUp">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600/20 border-t-amber-600"></div>
              <p className="text-amber-700 font-medium animate-pulse">Loading sweets...</p>
            </div>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20 animate-fadeInUp">
            <div className="inline-block p-4 rounded-full bg-amber-100/30 mb-4">
              <Candy className="w-16 h-16 text-amber-300 animate-float" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No sweets found</h3>
            <p className="text-gray-500">
              {isAdmin ? 'Add your first sweet to get started!' : 'Check back later for new sweets!'}
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
