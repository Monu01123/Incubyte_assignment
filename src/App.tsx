import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import { Cart } from './pages/Cart';
import { Orders } from './pages/Orders';
import { AdminDashboard } from './pages/AdminDashboard';
import { CartIcon } from './components/Cart/CartIcon';
import { Candy, LogOut, Package, BarChart3, ShoppingBag } from 'lucide-react';

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen gradient-brand flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(217, 119, 6, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Branding Header */}
      <div className="absolute top-8 left-8 flex items-center gap-4 animate-slideInLeft z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-2xl shadow-amber-600/50 animate-glow">
            <Candy className="w-10 h-10 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-amber-900 via-orange-700 to-amber-900 bg-clip-text text-transparent">
            Divine Sweets
          </h1>
          <p className="text-sm text-gray-700 font-serif italic">Blessed offerings await you</p>
        </div>
      </div>

      {/* Right Side Quote */}
      <div className="absolute top-1/4 right-8 hidden lg:block animate-fadeInUp z-10" style={{ animationDelay: '0.5s' }}>
        <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-md rounded-2xl p-6 border border-amber-200/50 shadow-xl max-w-xs">
          <p className="text-lg font-serif italic text-amber-800 mb-2">
            "Sweetness shared is happiness multiplied"
          </p>
          <div className="flex items-center gap-2 text-amber-600">
            <div className="w-8 h-px bg-amber-300"></div>
            <span className="text-sm font-serif">Divine Blessings</span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        {showLogin ? (
          <LoginForm onToggleForm={() => setShowLogin(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setShowLogin(true)} />
        )}
      </div>

      {/* Bottom Quote */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-fadeInUp z-10" style={{ animationDelay: '0.8s' }}>
        <p className="text-gray-600 font-serif italic text-sm">
          "May your journey with us be filled with divine sweetness"
        </p>
      </div>
    </div>
  );
}

function Navigation() {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-amber-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors group">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
                <Candy className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl font-serif bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                Divine Sweets
              </span>
            </Link>
            <Link to="/" className="text-gray-700 hover:text-amber-700 transition-colors font-medium">
              Shop
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-amber-700 transition-colors flex items-center gap-1 font-medium">
              <CartIcon />
              Cart
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-amber-700 transition-colors flex items-center gap-1 font-medium">
              <Package className="w-4 h-4" />
              Orders
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-amber-700 transition-colors flex items-center gap-1 font-medium">
                <BarChart3 className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isSuperAdmin && (
              <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-xs font-semibold">
                Super Admin
              </span>
            )}
            {isAdmin && !isSuperAdmin && (
              <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-xs font-semibold">
                Admin
              </span>
            )}
            <span className="text-gray-700 font-medium">{user.email}</span>
            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-brand flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600/20 border-t-amber-600"></div>
          <p className="text-amber-700 font-medium animate-pulse">Loading your sweet treats...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && <Navigation />}
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <AuthPage />} />
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/" />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/" />} />
        <Route path="/orders/:id" element={user ? <Orders /> : <Navigate to="/" />} />
        <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
