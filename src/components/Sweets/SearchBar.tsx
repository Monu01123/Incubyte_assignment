import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({
      name: name || undefined,
      category: category || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleClear = () => {
    setName('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
            showFilters
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="chocolate">Chocolate</option>
              <option value="candy">Candy</option>
              <option value="gummy">Gummy</option>
              <option value="lollipop">Lollipop</option>
              <option value="taffy">Taffy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="$0.00"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="$100.00"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
